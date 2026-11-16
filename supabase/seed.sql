-- ==============================================================================
-- ResQLink Sample Seed Data (Academic Prototype)
-- Demonstrating realistic emergency requests, donations, volunteers & allocations
-- Center Coordinates: Metro Emergency Relief Zone (Lat: 13.0400 - 13.1200, Lon: 80.2000 - 80.2900)
-- ==============================================================================

-- Clear existing data
TRUNCATE TABLE allocations CASCADE;
TRUNCATE TABLE volunteers CASCADE;
TRUNCATE TABLE resources CASCADE;
TRUNCATE TABLE emergency_requests CASCADE;

-- ------------------------------------------------------------------------------
-- 1. SEED EMERGENCY REQUESTS (6+ records)
-- Formula: priority_score = (urgency * 20) + (LEAST(people_affected, 100) * 0.5)
-- ------------------------------------------------------------------------------
INSERT INTO emergency_requests 
(id, requester_name, title, resource_type, quantity, urgency, people_affected, latitude, longitude, description, priority_score, priority_category, status, created_at)
VALUES
(
    '11111111-1111-1111-1111-111111111101',
    'Care & Hope Foundation',
    'Urgent Insulin & Trauma Kits for Flooded Clinic',
    'Medicines',
    40,
    5,
    150,
    13.0827,
    80.2707,
    'Submerged ground floor; insulin refrigeration compromised. 150 diabetic and injured evacuees need immediate supply.',
    150.00,
    'Critical',
    'Pending',
    NOW() - INTERVAL '4 hours'
),
(
    '11111111-1111-1111-1111-111111111102',
    'Red Shield Relief',
    'Clean Drinking Water for Community Shelter',
    'Drinking Water',
    500,
    5,
    95,
    13.0520,
    80.2510,
    'Municipal water pipeline severed. 95 refugees including 30 children lacking safe drinking water.',
    147.50,
    'Critical',
    'Pending',
    NOW() - INTERVAL '3 hours'
),
(
    '11111111-1111-1111-1111-111111111103',
    'Civic Action Network',
    'Ready-to-Eat Food Packets for Isolated Ward',
    'Food',
    300,
    4,
    80,
    13.0600,
    80.2300,
    'Road access cut by flash flooding. Need ready rations for 80 families pending drainage.',
    120.00,
    'Critical',
    'Assigned',
    NOW() - INTERVAL '2 hours'
),
(
    '11111111-1111-1111-1111-111111111104',
    'Disaster Relief Corps',
    'Waterproof Tarpaulins and Emergency Tents',
    'Shelter',
    50,
    3,
    50,
    13.0350,
    80.2100,
    'Temporary tent setups required as school shelter reached maximum capacity.',
    85.00,
    'Critical',
    'Pending',
    NOW() - INTERVAL '1 hour'
),
(
    '11111111-1111-1111-1111-111111111105',
    'Green Earth Helpers',
    'Dry Clothing & Blankets for Displaced Families',
    'Clothing',
    100,
    3,
    30,
    13.0950,
    80.2850,
    'Evening temperatures dropping; blankets and warm clothes requested for displaced seniors.',
    75.00,
    'High',
    'Completed',
    NOW() - INTERVAL '8 hours'
),
(
    '11111111-1111-1111-1111-111111111106',
    'Coastal Community NGO',
    'Portable Oxygen Concentrators',
    'Medical Equipment',
    5,
    4,
    8,
    13.0420,
    80.2600,
    'Backup power failing at secondary triage desk. Urgent oxygen support needed for severe respiratory patients.',
    84.00,
    'High',
    'Pending',
    NOW() - INTERVAL '30 minutes'
),
(
    '11111111-1111-1111-1111-111111111107',
    'Unity Welfare Group',
    'Sanitation Kits and Disinfectants',
    'Other',
    60,
    2,
    40,
    13.1100,
    80.2200,
    'Sanitation items needed for ongoing preventative cleanup.',
    60.00,
    'Medium',
    'Pending',
    NOW() - INTERVAL '5 hours'
),
(
    '11111111-1111-1111-1111-111111111108',
    'Local Youth League',
    'Recreation & Stationery for Children Shelter',
    'Other',
    25,
    1,
    20,
    13.0200,
    80.2400,
    'Activity sets to engage displaced children during recovery phase.',
    30.00,
    'Low',
    'Pending',
    NOW() - INTERVAL '10 hours'
);

-- ------------------------------------------------------------------------------
-- 2. SEED RESOURCES (8+ records)
-- Varying distances, types, quantities, and statuses (Available, Unavailable, etc.)
-- ------------------------------------------------------------------------------
INSERT INTO resources
(id, resource_name, resource_type, quantity, latitude, longitude, donor_name, description, status, created_at)
VALUES
(
    '22222222-2222-2222-2222-222222222201',
    'Bottled Mineral Water 20L Cans',
    'Drinking Water',
    600,
    13.0550,
    80.2550,
    'Apex Logistics Ltd',
    'Sealed potable water cans in commercial warehouse, close to central district.',
    'Available',
    NOW() - INTERVAL '6 hours'
),
(
    '22222222-2222-2222-2222-222222222202',
    'Purified Drinking Water Cartons (Far Warehouse)',
    'Drinking Water',
    400,
    13.1800,
    80.3100,
    'North Metro Beverage Corp',
    'Water supplies located in North outer ring warehouse (~15km away).',
    'Available',
    NOW() - INTERVAL '12 hours'
),
(
    '22222222-2222-2222-2222-222222222203',
    'Emergency First Aid & Insulin Ampoules',
    'Medicines',
    80,
    13.0800,
    80.2650,
    'Apollo Life Foundation',
    'Temperature-regulated insulated containers with insulin and dressing sets.',
    'Available',
    NOW() - INTERVAL '5 hours'
),
(
    '22222222-2222-2222-2222-222222222204',
    'Packaged Meal Rations (High Energy)',
    'Food',
    500,
    13.0630,
    80.2350,
    'Mercy Kitchen Collective',
    'Ready-to-eat nutrient sealed packets with 1-year shelf stability.',
    'Partially Allocated',
    NOW() - INTERVAL '4 hours'
),
(
    '22222222-2222-2222-2222-222222222205',
    'All-Weather Tarpaulins & Support Poles',
    'Shelter',
    120,
    13.0310,
    80.2150,
    'BuildSafe Hardware Co',
    'Heavy-duty 150 GSM waterproof sheets with eyelets.',
    'Available',
    NOW() - INTERVAL '3 hours'
),
(
    '22222222-2222-2222-2222-222222222206',
    'Woolen Blankets & Thermal Wraps',
    'Clothing',
    250,
    13.0900,
    80.2800,
    'Textile Workers Union',
    'Clean sanitized thermal fleece blankets packed in bundles of 10.',
    'Available',
    NOW() - INTERVAL '7 hours'
),
(
    '22222222-2222-2222-2222-222222222207',
    'Portable Battery-Operated Oxygen Concentrators',
    'Medical Equipment',
    6,
    13.0450,
    80.2620,
    'CarePlus Medical Equipment',
    'Fully charged 5L/min portable units with nasal cannulas.',
    'Available',
    NOW() - INTERVAL '2 hours'
),
(
    '22222222-2222-2222-2222-222222222208',
    'Expired Antibiotics Stock (Quarantined)',
    'Medicines',
    0,
    13.0700,
    80.2600,
    'City Warehouse 4',
    'Awaiting disposal; not suitable for emergency distribution.',
    'Unavailable',
    NOW() - INTERVAL '24 hours'
);

-- ------------------------------------------------------------------------------
-- 3. SEED VOLUNTEERS (6+ records)
-- Specific skills, vehicles, locations, and availability
-- ------------------------------------------------------------------------------
INSERT INTO volunteers
(id, name, phone, skills, has_vehicle, latitude, longitude, available, created_at)
VALUES
(
    '33333333-3333-3333-3333-333333333301',
    'Dr. Priya Sharma',
    '+91-98401-22345',
    ARRAY['Medical assistance', 'Rescue support'],
    true,
    13.0810,
    80.2680,
    true,
    NOW() - INTERVAL '2 days'
),
(
    '33333333-3333-3333-3333-333333333302',
    'Vikram Raman',
    '+91-98402-33456',
    ARRAY['Transportation', 'Logistics'],
    true,
    13.0535,
    80.2520,
    true,
    NOW() - INTERVAL '1 day'
),
(
    '33333333-3333-3333-3333-333333333303',
    'Ananya Sundaram',
    '+91-98403-44567',
    ARRAY['Food distribution', 'General assistance'],
    false,
    13.0590,
    80.2320,
    false,
    NOW() - INTERVAL '3 days'
),
(
    '33333333-3333-3333-3333-333333333304',
    'Karthik Menon',
    '+91-98404-55678',
    ARRAY['Transportation', 'Food distribution', 'Logistics'],
    true,
    13.0610,
    80.2310,
    true,
    NOW() - INTERVAL '12 hours'
),
(
    '33333333-3333-3333-3333-333333333305',
    'Siddharth Patel',
    '+91-98405-66789',
    ARRAY['Rescue support', 'Transportation'],
    true,
    13.0360,
    80.2120,
    true,
    NOW() - INTERVAL '4 days'
),
(
    '33333333-3333-3333-3333-333333333306',
    'Deepa Krishnan',
    '+91-98406-77890',
    ARRAY['Medical assistance', 'General assistance'],
    false,
    13.0410,
    80.2580,
    true,
    NOW() - INTERVAL '5 days'
);

-- ------------------------------------------------------------------------------
-- 4. SEED SAMPLE ALLOCATIONS (3 records in different statuses)
-- ------------------------------------------------------------------------------
INSERT INTO allocations
(id, request_id, resource_id, volunteer_id, quantity, resource_distance_km, volunteer_distance_km, status, created_at)
VALUES
(
    '44444444-4444-4444-4444-444444444401',
    '11111111-1111-1111-1111-111111111103',
    '22222222-2222-2222-2222-222222222204',
    '33333333-3333-3333-3333-333333333304',
    300,
    0.64,
    0.15,
    'Approved',
    NOW() - INTERVAL '1 hour'
),
(
    '44444444-4444-4444-4444-444444444402',
    '11111111-1111-1111-1111-111111111105',
    '22222222-2222-2222-2222-222222222206',
    '33333333-3333-3333-3333-333333333302',
    100,
    0.78,
    4.82,
    'Completed',
    NOW() - INTERVAL '7 hours'
),
(
    '44444444-4444-4444-4444-444444444403',
    '11111111-1111-1111-1111-111111111102',
    '22222222-2222-2222-2222-222222222201',
    '33333333-3333-3333-3333-333333333302',
    500,
    0.54,
    0.21,
    'Proposed',
    NOW() - INTERVAL '15 minutes'
);
