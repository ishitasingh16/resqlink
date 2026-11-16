# ResQLink
### An Intelligent Emergency Resource Allocation and Volunteer Coordination Platform
**Tagline:** *Connecting Help. Saving Time.*

---

## 1. Project Overview & Problem Statement

During natural disasters (cyclones, floods, earthquakes) and humanitarian crises, relief coordination suffers from three critical bottlenecks:
1. **Information Asymmetry:** Non-Governmental Organizations (NGOs) and emergency triage shelters cannot efficiently communicate urgent resource deficits to local donors in real-time.
2. **Lack of Automated Prioritization:** Relief demands are often fulfilled on a first-come, first-served basis rather than being triaged according to the severity of the crisis and the number of human lives at risk.
3. **Suboptimal Geographical Logistics:** Relief supplies and volunteers are often dispatched from distant facilities while closer donors or skilled responders remain unutilized, causing life-threatening delivery delays.

**ResQLink** is a full-stack, responsive web application engineered to solve these challenges. Designed as an academic prototype for emergency resource coordination, it dynamically calculates emergency triage scores, computes spherical geographical distance matrices using the Haversine formula, and matches demands with the closest available donors and skilled volunteers.

---

## 2. Proposed Solution & Core Workflow

ResQLink establishes an automated, end-to-end emergency relief supply chain:

```
[ NGO Submits Request ] 
         │
         ▼
[ Automated Priority Scoring ] ──► (Urgency Level 1-5 & People Affected)
         │
         ▼
[ Haversine Proximity Search ] ──► (Filter by Resource Type, Status & Inventory)
         │
         ▼
[ Volunteer Skill Matching ]   ──► (Filter by Skills, Vehicle & Availability)
         │
         ▼
[ Transparent Match Diagnostic ] ──► (Ranks closest suitable Depot & Responder)
         │
         ▼
[ Atomic Admin Approval ]      ──► (Locks Inventory & Dispatches Volunteer)
         │
         ▼
[ Mission Fulfillment ]        ──► (Marked Complete & Volunteer Released)
```

---

## 3. Technology Stack

- **Frontend Framework:** React 18 (Vite)
- **Language:** JavaScript (ESNext, Modern Modular Architecture)
- **Styling:** CSS3 & Tailwind CSS (Emergency management SaaS palette, light mode, accessibility-tested)
- **Routing:** React Router DOM (Client-side routing with role-specific views)
- **Icons:** Lucide React
- **Geographic Mapping:** Leaflet 1.9 & React-Leaflet (OpenStreetMap raster tiles, custom SVG pinpoint markers, geodesic distance lines)
- **Database & Backend:** Supabase PostgreSQL (Row Level Security, Stored Procedures, Foreign Keys, Check Constraints)
- **Backend SDK:** `@supabase/supabase-js`
- **Deployment Platform:** Vercel (Includes `vercel.json` SPA rewrite rules)

---

## 4. User Roles & Demo Login Architecture

ResQLink provides four dedicated role dashboards with demo authentication simulating field user states:

| Role | Default Demo Identity | Operational Capabilities |
| :--- | :--- | :--- |
| **NGO** | Care & Hope Foundation | Submits emergency requests, enters crisis coordinates, monitors urgency triage scores and delivery statuses. |
| **Donor** | Apex Logistics Ltd | Registers relief inventories, edits stock quantities, toggles depot availability, and tracks allocation dispatches. |
| **Volunteer** | Dr. Priya Sharma | Reviews assigned missions, accepts/declines transport tasks, updates duty readiness, and marks completed deliveries. |
| **Admin** | State Disaster HQ | Central command dashboard, monitors system metrics, triggers multi-criteria matching, and executes atomic allocation approvals. |

> **Academic Prototype Disclaimer:** The role selector on the login screen is a simulation designed to facilitate rapid academic evaluation of all workflows without credential barriers. Do not store real personal identity or real emergency distress data in this prototype.

---

## 5. System Architecture & Project Structure

```text
ResQLink/
├── public/
├── src/
│   ├── algorithms/
│   │   ├── priority.js          # Urgency prioritization formula
│   │   ├── distance.js          # Haversine distance calculator
│   │   └── allocation.js        # Multi-criteria greedy matching engine
│   ├── components/
│   │   ├── Navbar.jsx           # Global header with live mode & role selector
│   │   ├── Sidebar.jsx          # Role-specific responsive navigation
│   │   ├── StatCard.jsx         # Metric visualization cards
│   │   ├── StatusBadge.jsx      # Semantic status indicator badges
│   │   ├── RequestForm.jsx      # Emergency request creator with live score preview
│   │   ├── ResourceForm.jsx     # Relief inventory intake form
│   │   ├── MatchingModal.jsx    # Transparent matching & recommendation modal
│   │   ├── MapView.jsx          # Interactive Leaflet map with custom SVG markers
│   │   └── LoadingState.jsx     # Loading feedback spinner
│   ├── context/
│   │   └── AuthContext.jsx      # Demo role state, session storage & notifications
│   ├── lib/
│   │   └── supabase.js          # Supabase client & fallback detector
│   ├── pages/
│   │   ├── Login.jsx            # Welcome screen & demo role selector
│   │   ├── NGODashboard.jsx     # NGO operations & request submission
│   │   ├── DonorDashboard.jsx   # Donor inventory & stock management
│   │   ├── VolunteerDashboard.jsx # Volunteer tasks, profile & availability
│   │   ├── AdminDashboard.jsx   # State HQ command center & triage queue
│   │   ├── Requests.jsx         # Comprehensive requests registry
│   │   ├── Resources.jsx        # Emergency inventory pool
│   │   ├── Volunteers.jsx       # Field responder network roster
│   │   ├── Allocations.jsx      # Allocation pipeline & approval workflow
│   │   └── MapPage.jsx          # Full GIS situation map with vector inspection
│   ├── services/
│   │   ├── mockData.js          # Realistic seed data for offline demo mode
│   │   ├── storageAdapter.js    # Local persistence adapter with reset button
│   │   ├── requestService.js    # Requests CRUD & priority sorting
│   │   ├── resourceService.js   # Resource stock management service
│   │   ├── volunteerService.js  # Volunteer availability service
│   │   └── allocationService.js # Allocation proposals & atomic approval
│   ├── App.jsx                  # Main routing, layout & demo banners
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles, Tailwind & Leaflet customizations
├── supabase/
│   ├── schema.sql               # PostgreSQL tables, indexes & stored procedures
│   └── seed.sql                 # Sample dataset (8 requests, 8 resources, 6 volunteers)
├── .env.example                 # Supabase environment variables template
├── .gitignore                   # Ignored files (node_modules, dist, .env)
├── package.json                 # Dependencies and build scripts
├── vercel.json                  # Vercel deployment rewrites for SPA routing
├── vite.config.js               # Vite configuration with chunk splitting
└── README.md                    # Project documentation
```

---

## 6. Algorithmic Implementations

### A. Priority Calculation Algorithm (`src/algorithms/priority.js`)

The priority calculation formula triages incoming emergency requests:

$$\text{priorityScore} = (\text{urgency} \times 20) + (\min(\text{peopleAffected}, 100) \times 0.5)$$

- **Urgency (1 to 5):** Contributes up to $5 \times 20 = 100$ points. Represents immediate threat to life, medical criticality, or structural danger.
- **People Affected:** Weighted at 0.5 points per person and capped at 100 ($\le 50$ points) to prevent massive population figures from completely drowning out acute, severe emergencies.
- **Maximum Theoretical Score:** 150.00 points.

**Priority Categories:**
- **Critical:** $\text{Score} \ge 85$ (Immediate crisis, trauma medical kits, flooded clinics)
- **High:** $65 \le \text{Score} < 85$ (Urgent potable water, food rations, oxygen supply)
- **Medium:** $40 \le \text{Score} < 65$ (Sanitation kits, secondary shelters)
- **Low:** $\text{Score} < 40$ (Non-emergency stationary, recovery supplies)

---

### B. Haversine Distance Formula (`src/algorithms/distance.js`)

To compute the approximate great-circle distance between two geographic coordinates $(\text{lat}_1, \text{lon}_1)$ and $(\text{lat}_2, \text{lon}_2)$ on the spherical Earth:

$$a = \sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1) \cdot \cos(\text{lat}_2) \cdot \sin^2\left(\frac{\Delta \text{lon}}{2}\right)$$

$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1 - a}\right)$$

$$d = R \cdot c$$

Where:
- $R \approx 6371.0088\text{ km}$ (mean radius of Earth).
- Input angles are converted from degrees to radians.
- Distance is returned in kilometers rounded to two decimal places.

---

### C. Multi-Criteria Greedy Matching Algorithm (`src/algorithms/allocation.js`)

For any selected emergency request:
1. **Resource Category Filter:** Filters resources where `resource_type == request.resource_type`.
2. **Status & Inventory Check:** Discards resources marked as `Unavailable`, `Depleted`, or with `quantity <= 0`.
3. **Proximity Ranking:** Applies the Haversine formula between the request coordinates and each depot coordinate, sorting candidates closest first.
4. **Skill Mapping:** Identifies required volunteer competencies based on resource category:
   - *Medicines / Medical Equipment:* `Medical assistance`, `Transportation`
   - *Food / Drinking Water:* `Food distribution`, `Transportation`, `Logistics`
   - *Shelter / Other:* `Rescue support`, `Logistics`, `General assistance`
5. **Volunteer Availability & Distance:** Filters volunteers where `available == true` who possess matching skills, computes their distance to the emergency site, and ranks them by proximity (with vehicle bonus).
6. **Transparent Diagnostics:** Generates diagnostic strings explaining why other resources/volunteers were excluded or ranked lower.

---

### D. Data Integrity & Atomic Transactions (`supabase/schema.sql`)

To prevent duplicate allocations and race conditions, allocation confirmation is handled via an atomic PostgreSQL stored procedure:

```sql
CREATE OR REPLACE FUNCTION approve_allocation(p_allocation_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
...
```

**Integrity Guarantees:**
1. Locks the allocation record with `FOR UPDATE`.
2. Rechecks that the associated resource still possesses `quantity >= allocation.quantity`.
3. Atomically subtracts `allocation.quantity` from `resources.quantity`.
4. Sets the resource status to `Depleted` if remaining stock reaches 0.
5. Updates `emergency_requests.status` to `Assigned`.
6. Sets `volunteers.available` to `false`.
7. Transitions `allocations.status` to `Approved`.

---

## 7. Sample Demonstration Data

The project includes realistic fictional seed data centered on an urban disaster relief zone ($\approx 13.04^\circ\text{N} - 13.12^\circ\text{N}$, $80.20^\circ\text{E} - 80.29^\circ\text{E}$):

- **8 Emergency Requests:** Ranging from Critical (Urgency 5 insulin shortage, score: 150) to Low (stationery sets, score: 30).
- **8 Resource Depots:** Medicines, water, ration packets, tarpaulins, oxygen concentrators, including one depleted/unavailable batch to verify exclusion logic.
- **6 Field Volunteers:** Doctors, truck drivers, rescue personnel with various skills, vehicle types, and on-duty statuses.
- **3 Sample Allocations:** Across Proposed, Approved, and Completed statuses.

---

## 8. Installation & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/resqlink.git
cd resqlink
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

> **Instant Demo Mode:** If Supabase credentials are not configured, ResQLink automatically launches in **Demo Mode** with persistent local storage and sample data. All forms, matching algorithms, status updates, and map markers function immediately without requiring a backend setup!

---

## 9. Supabase PostgreSQL Setup Instructions

To connect ResQLink to your live Supabase cloud database:

1. **Create a Supabase Project:**
   - Go to [https://supabase.com](https://supabase.com) and create a new project.
   - Note your **Project URL** and **anon / public key** from `Project Settings` > `API`.

2. **Execute the Database Schema:**
   - In your Supabase dashboard, navigate to **SQL Editor**.
   - Copy the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
   - This creates tables, check constraints, indexes, RLS policies, and stored procedures (`approve_allocation`, `complete_allocation`, `reject_allocation`).

3. **Insert the Seed Data:**
   - In the SQL Editor, copy the contents of [`supabase/seed.sql`](supabase/seed.sql) and click **Run**.
   - This populates sample requests, donors, volunteers, and allocations.

4. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-public-key
     ```
   - Restart the Vite dev server (`npm run dev`). The header badge will change to **Supabase Live**.

---

## 10. Vercel Deployment Instructions

ResQLink includes `vercel.json` configured with SPA rewrites to ensure direct route navigation works without 404 errors.

### Deploying via Vercel CLI
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root.
3. Follow the CLI prompts to deploy.

### Deploying via GitHub & Vercel Dashboard
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New** > **Project**.
3. Import your `resqlink` repository.
4. Set Framework Preset: **Vite**.
5. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   *(Optional: If left blank, the live deployment will run in Demo Mode).*
6. Click **Deploy**.

---

## 11. Testing & Verification Checklist

- [x] **Vite Build:** `npm run build` runs cleanly with zero errors and optimized vendor chunk splitting.
- [x] **Role Authentication Simulation:** Instant switching between NGO, Donor, Volunteer, and Admin.
- [x] **Priority Calculation:** Verified live calculation `(urgency * 20) + (min(people, 100) * 0.5)` with automatic Critical/High/Medium/Low categorization.
- [x] **Haversine Distance Engine:** Accurate kilometer calculations across all coordinates.
- [x] **Smart Matching Algorithm:** Ranks nearest resources and skilled volunteers; excludes unavailable/depleted stocks.
- [x] **Atomic Allocation Approval:** Atomically checks stock, updates resource quantity, transitions request status, and locks volunteer availability.
- [x] **OpenStreetMap & Leaflet:** Renders color-coded markers (Red requests, Green resources, Blue volunteers), popups, distance vectors, and legend.
- [x] **Reset Demo Data:** One-click reset button in sidebar to return to the original seed state.

---

## 12. Limitations & Future Scope

### Prototype Limitations
- Role authorization is simulated for academic demonstration and does not use cryptographically signed JSON Web Tokens (JWT).
- The matching algorithm uses greedy proximity optimization rather than mixed-integer linear programming (MILP) or multi-depot vehicle routing (MDVRP).
- Coordinates are synthetic demo values.

### Future Scope
- Implementation of OpenRouteService / OSRM API for turn-by-turn road network routing and live traffic delays.
- Real-time SMS / WhatsApp emergency alerts via Twilio API.
- End-to-end user authentication via Supabase Auth with OAuth2 / SAML single sign-on.
- Multi-party split deliveries for large emergency quotas across multiple depots.

---

## 13. Academic Project Attribution

- **Project:** ResQLink - Intelligent Emergency Resource Allocation and Volunteer Coordination Platform
- **Degree:** Bachelor of Technology (B.Tech)
- **Academic Year:** 2026
- **License:** MIT License
