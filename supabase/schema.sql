-- ==============================================================================
-- ResQLink: Emergency Resource Allocation and Volunteer Coordination Platform
-- PostgreSQL Database Schema for Supabase
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running (safe initialization)
DROP TABLE IF EXISTS allocations CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS emergency_requests CASCADE;

-- ------------------------------------------------------------------------------
-- 1. EMERGENCY REQUESTS
-- ------------------------------------------------------------------------------
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_name TEXT NOT NULL,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    urgency INTEGER NOT NULL CHECK (urgency BETWEEN 1 AND 5),
    people_affected INTEGER NOT NULL CHECK (people_affected >= 0),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    description TEXT,
    priority_score NUMERIC(6, 2) NOT NULL,
    priority_category TEXT NOT NULL CHECK (priority_category IN ('Critical', 'High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In Transit', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_requests_priority ON emergency_requests(priority_score DESC);
CREATE INDEX idx_requests_status ON emergency_requests(status);
CREATE INDEX idx_requests_resource_type ON emergency_requests(resource_type);

-- ------------------------------------------------------------------------------
-- 2. RESOURCES
-- ------------------------------------------------------------------------------
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_name TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    donor_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Partially Allocated', 'Allocated', 'Depleted', 'Unavailable')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for resources
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_type ON resources(resource_type);

-- ------------------------------------------------------------------------------
-- 3. VOLUNTEERS
-- ------------------------------------------------------------------------------
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    has_vehicle BOOLEAN NOT NULL DEFAULT false,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for volunteers
CREATE INDEX idx_volunteers_available ON volunteers(available);

-- ------------------------------------------------------------------------------
-- 4. ALLOCATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE RESTRICT,
    volunteer_id UUID REFERENCES volunteers(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    resource_distance_km NUMERIC(8, 2) NOT NULL,
    volunteer_distance_km NUMERIC(8, 2),
    status TEXT NOT NULL DEFAULT 'Proposed' CHECK (status IN ('Proposed', 'Approved', 'Rejected', 'In Transit', 'Completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_allocations_request ON allocations(request_id);
CREATE INDEX idx_allocations_resource ON allocations(resource_id);
CREATE INDEX idx_allocations_volunteer ON allocations(volunteer_id);
CREATE INDEX idx_allocations_status ON allocations(status);

-- ------------------------------------------------------------------------------
-- 5. SECURE DATABASE TRANSACTIONS FOR ALLOCATIONS
-- Atomic approval ensuring availability recheck and consistency
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION approve_allocation(p_allocation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_allocation RECORD;
    v_resource RECORD;
    v_request RECORD;
BEGIN
    -- 1. Lock allocation record
    SELECT * INTO v_allocation
    FROM allocations
    WHERE id = p_allocation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Allocation record not found.');
    END IF;

    IF v_allocation.status != 'Proposed' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Allocation is not in Proposed status (current: ' || v_allocation.status || ').');
    END IF;

    -- 2. Lock & re-verify resource availability
    SELECT * INTO v_resource
    FROM resources
    WHERE id = v_allocation.resource_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Associated resource record not found.');
    END IF;

    IF v_resource.status = 'Unavailable' OR v_resource.quantity < v_allocation.quantity THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Insufficient resource quantity available. Required: ' || v_allocation.quantity || ', Available: ' || v_resource.quantity
        );
    END IF;

    -- 3. Update Resource quantity & status
    UPDATE resources
    SET 
        quantity = quantity - v_allocation.quantity,
        status = CASE 
            WHEN (quantity - v_allocation.quantity) = 0 THEN 'Depleted'
            ELSE 'Available'
        END
    WHERE id = v_allocation.resource_id;

    -- 4. Update Request status
    UPDATE emergency_requests
    SET status = 'Assigned'
    WHERE id = v_allocation.request_id;

    -- 5. Update Volunteer availability if assigned
    IF v_allocation.volunteer_id IS NOT NULL THEN
        UPDATE volunteers
        SET available = false
        WHERE id = v_allocation.volunteer_id;
    END IF;

    -- 6. Update Allocation status to Approved
    UPDATE allocations
    SET status = 'Approved'
    WHERE id = p_allocation_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Allocation approved successfully. Resource inventory and volunteer availability updated atomically.',
        'allocation_id', p_allocation_id
    );
END;
$$;

-- Complete an allocation transaction
CREATE OR REPLACE FUNCTION complete_allocation(p_allocation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_allocation RECORD;
BEGIN
    SELECT * INTO v_allocation
    FROM allocations
    WHERE id = p_allocation_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Allocation record not found.');
    END IF;

    -- Mark allocation as completed
    UPDATE allocations
    SET status = 'Completed'
    WHERE id = p_allocation_id;

    -- Mark request as completed
    UPDATE emergency_requests
    SET status = 'Completed'
    WHERE id = v_allocation.request_id;

    -- Release volunteer
    IF v_allocation.volunteer_id IS NOT NULL THEN
        UPDATE volunteers
        SET available = true
        WHERE id = v_allocation.volunteer_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Allocation marked completed. Volunteer is now available for new tasks.'
    );
END;
$$;

-- Reject a proposed allocation
CREATE OR REPLACE FUNCTION reject_allocation(p_allocation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE allocations
    SET status = 'Rejected'
    WHERE id = p_allocation_id AND status = 'Proposed';

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Allocation not found or not in Proposed status.');
    END IF;

    RETURN jsonb_build_object('success', true, 'message', 'Allocation rejected.');
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- NOTE: In this academic prototype, demo roles simulate user activity.
-- We enable standard RLS with transparent demo access for academic presentation.
-- Never use this configuration for real emergency production services.
-- ------------------------------------------------------------------------------
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to requests" ON emergency_requests FOR SELECT USING (true);
CREATE POLICY "Allow public insert to requests" ON emergency_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to requests" ON emergency_requests FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Allow public insert to resources" ON resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to resources" ON resources FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Allow public insert to volunteers" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to volunteers" ON volunteers FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to allocations" ON allocations FOR SELECT USING (true);
CREATE POLICY "Allow public insert to allocations" ON allocations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to allocations" ON allocations FOR UPDATE USING (true);
