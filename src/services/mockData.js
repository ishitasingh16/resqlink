/**
 * Initial Fictional Seed Data for ResQLink Demo Mode
 * Used when running without an active Supabase cloud connection.
 * Coordinates are centered around an urban/coastal emergency response grid.
 */

export const INITIAL_REQUESTS = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    requester_name: 'Care & Hope Foundation',
    title: 'Urgent Insulin & Trauma Kits for Flooded Clinic',
    resource_type: 'Medicines',
    quantity: 40,
    urgency: 5,
    people_affected: 150,
    latitude: 13.0827,
    longitude: 80.2707,
    description: 'Submerged ground floor; insulin refrigeration compromised. 150 diabetic and injured evacuees need immediate supply.',
    priority_score: 150.00,
    priority_category: 'Critical',
    status: 'Pending',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    requester_name: 'Red Shield Relief',
    title: 'Clean Drinking Water for Community Shelter',
    resource_type: 'Drinking Water',
    quantity: 500,
    urgency: 5,
    people_affected: 95,
    latitude: 13.0520,
    longitude: 80.2510,
    description: 'Municipal water pipeline severed. 95 refugees including 30 children lacking safe drinking water.',
    priority_score: 147.50,
    priority_category: 'Critical',
    status: 'Pending',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    requester_name: 'Civic Action Network',
    title: 'Ready-to-Eat Food Packets for Isolated Ward',
    resource_type: 'Food',
    quantity: 300,
    urgency: 4,
    people_affected: 80,
    latitude: 13.0600,
    longitude: 80.2300,
    description: 'Road access cut by flash flooding. Need ready rations for 80 families pending drainage.',
    priority_score: 120.00,
    priority_category: 'Critical',
    status: 'Assigned',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    requester_name: 'Disaster Relief Corps',
    title: 'Waterproof Tarpaulins and Emergency Tents',
    resource_type: 'Shelter',
    quantity: 50,
    urgency: 3,
    people_affected: 50,
    latitude: 13.0350,
    longitude: 80.2100,
    description: 'Temporary tent setups required as school shelter reached maximum capacity.',
    priority_score: 85.00,
    priority_category: 'Critical',
    status: 'Pending',
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    requester_name: 'Green Earth Helpers',
    title: 'Dry Clothing & Blankets for Displaced Families',
    resource_type: 'Clothing',
    quantity: 100,
    urgency: 3,
    people_affected: 30,
    latitude: 13.0950,
    longitude: 80.2850,
    description: 'Evening temperatures dropping; blankets and warm clothes requested for displaced seniors.',
    priority_score: 75.00,
    priority_category: 'High',
    status: 'Completed',
    created_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    requester_name: 'Coastal Community NGO',
    title: 'Portable Oxygen Concentrators',
    resource_type: 'Medical Equipment',
    quantity: 5,
    urgency: 4,
    people_affected: 8,
    latitude: 13.0420,
    longitude: 80.2600,
    description: 'Backup power failing at secondary triage desk. Urgent oxygen support needed for severe respiratory patients.',
    priority_score: 84.00,
    priority_category: 'High',
    status: 'Pending',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111107',
    requester_name: 'Unity Welfare Group',
    title: 'Sanitation Kits and Disinfectants',
    resource_type: 'Other',
    quantity: 60,
    urgency: 2,
    people_affected: 40,
    latitude: 13.1100,
    longitude: 80.2200,
    description: 'Sanitation items needed for ongoing preventative cleanup.',
    priority_score: 60.00,
    priority_category: 'Medium',
    status: 'Pending',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: '11111111-1111-1111-1111-111111111108',
    requester_name: 'Local Youth League',
    title: 'Recreation & Stationery for Children Shelter',
    resource_type: 'Other',
    quantity: 25,
    urgency: 1,
    people_affected: 20,
    latitude: 13.0200,
    longitude: 80.2400,
    description: 'Activity sets to engage displaced children during recovery phase.',
    priority_score: 30.00,
    priority_category: 'Low',
    status: 'Pending',
    created_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_RESOURCES = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    resource_name: 'Bottled Mineral Water 20L Cans',
    resource_type: 'Drinking Water',
    quantity: 600,
    latitude: 13.0550,
    longitude: 80.2550,
    donor_name: 'Apex Logistics Ltd',
    description: 'Sealed potable water cans in commercial warehouse, close to central district.',
    status: 'Available',
    created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    resource_name: 'Purified Drinking Water Cartons (Far Warehouse)',
    resource_type: 'Drinking Water',
    quantity: 400,
    latitude: 13.1800,
    longitude: 80.3100,
    donor_name: 'North Metro Beverage Corp',
    description: 'Water supplies located in North outer ring warehouse (~15km away).',
    status: 'Available',
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    resource_name: 'Emergency First Aid & Insulin Ampoules',
    resource_type: 'Medicines',
    quantity: 80,
    latitude: 13.0800,
    longitude: 80.2650,
    donor_name: 'Apollo Life Foundation',
    description: 'Temperature-regulated insulated containers with insulin and dressing sets.',
    status: 'Available',
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    resource_name: 'Packaged Meal Rations (High Energy)',
    resource_type: 'Food',
    quantity: 500,
    latitude: 13.0630,
    longitude: 80.2350,
    donor_name: 'Mercy Kitchen Collective',
    description: 'Ready-to-eat nutrient sealed packets with 1-year shelf stability.',
    status: 'Partially Allocated',
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    resource_name: 'All-Weather Tarpaulins & Support Poles',
    resource_type: 'Shelter',
    quantity: 120,
    latitude: 13.0310,
    longitude: 80.2150,
    donor_name: 'BuildSafe Hardware Co',
    description: 'Heavy-duty 150 GSM waterproof sheets with eyelets.',
    status: 'Available',
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    resource_name: 'Woolen Blankets & Thermal Wraps',
    resource_type: 'Clothing',
    quantity: 250,
    latitude: 13.0900,
    longitude: 80.2800,
    donor_name: 'Textile Workers Union',
    description: 'Clean sanitized thermal fleece blankets packed in bundles of 10.',
    status: 'Available',
    created_at: new Date(Date.now() - 7 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222207',
    resource_name: 'Portable Battery-Operated Oxygen Concentrators',
    resource_type: 'Medical Equipment',
    quantity: 6,
    latitude: 13.0450,
    longitude: 80.2620,
    donor_name: 'CarePlus Medical Equipment',
    description: 'Fully charged 5L/min portable units with nasal cannulas.',
    status: 'Available',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222208',
    resource_name: 'Expired Antibiotics Stock (Quarantined)',
    resource_type: 'Medicines',
    quantity: 0,
    latitude: 13.0700,
    longitude: 80.2600,
    donor_name: 'City Warehouse 4',
    description: 'Awaiting disposal; not suitable for emergency distribution.',
    status: 'Unavailable',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_VOLUNTEERS = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    name: 'Dr. Priya Sharma',
    phone: '+91-98401-22345',
    skills: ['Medical assistance', 'Rescue support'],
    has_vehicle: true,
    latitude: 13.0810,
    longitude: 80.2680,
    available: true,
    created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    name: 'Vikram Raman',
    phone: '+91-98402-33456',
    skills: ['Transportation', 'Logistics'],
    has_vehicle: true,
    latitude: 13.0535,
    longitude: 80.2520,
    available: true,
    created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    name: 'Ananya Sundaram',
    phone: '+91-98403-44567',
    skills: ['Food distribution', 'General assistance'],
    has_vehicle: false,
    latitude: 13.0590,
    longitude: 80.2320,
    available: false,
    created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    name: 'Karthik Menon',
    phone: '+91-98404-55678',
    skills: ['Transportation', 'Food distribution', 'Logistics'],
    has_vehicle: true,
    latitude: 13.0610,
    longitude: 80.2310,
    available: false, // Currently assigned to allocation 444401
    created_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333305',
    name: 'Siddharth Patel',
    phone: '+91-98405-66789',
    skills: ['Rescue support', 'Transportation'],
    has_vehicle: true,
    latitude: 13.0360,
    longitude: 80.2120,
    available: true,
    created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333306',
    name: 'Deepa Krishnan',
    phone: '+91-98406-77890',
    skills: ['Medical assistance', 'General assistance'],
    has_vehicle: false,
    latitude: 13.0410,
    longitude: 80.2580,
    available: true,
    created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_ALLOCATIONS = [
  {
    id: '44444444-4444-4444-4444-444444444401',
    request_id: '11111111-1111-1111-1111-111111111103',
    resource_id: '22222222-2222-2222-2222-222222222204',
    volunteer_id: '33333333-3333-3333-3333-333333333304',
    quantity: 300,
    resource_distance_km: 0.64,
    volunteer_distance_km: 0.15,
    status: 'Approved',
    created_at: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444402',
    request_id: '11111111-1111-1111-1111-111111111105',
    resource_id: '22222222-2222-2222-2222-222222222206',
    volunteer_id: '33333333-3333-3333-3333-333333333302',
    quantity: 100,
    resource_distance_km: 0.78,
    volunteer_distance_km: 4.82,
    status: 'Completed',
    created_at: new Date(Date.now() - 7 * 3600 * 1000).toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444403',
    request_id: '11111111-1111-1111-1111-111111111102',
    resource_id: '22222222-2222-2222-2222-222222222201',
    volunteer_id: '33333333-3333-3333-3333-333333333302',
    quantity: 500,
    resource_distance_km: 0.54,
    volunteer_distance_km: 0.21,
    status: 'Proposed',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];
