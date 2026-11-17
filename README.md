# 🚨 ResQLink
### Intelligent Emergency Resource Allocation and Volunteer Coordination Platform

**Tagline: Connecting Help. Saving Time.**

ResQLink is a full-stack, responsive web application designed to improve emergency relief coordination by connecting NGOs, donors, emergency resource providers and volunteers through a centralized platform.

It uses priority-based emergency triage, geographical distance calculation and intelligent resource-volunteer matching to help coordinate relief operations efficiently.

---

## 📌 Table of Contents

1. [Project Overview](#-project-overview)
2. [Problem Statement](#-problem-statement)
3. [Project Objectives](#-project-objectives)
4. [Proposed Solution](#-proposed-solution)
5. [Key Features](#-key-features)
6. [System Modules](#-system-modules)
7. [System Workflow](#-system-workflow)
8. [User Roles](#-user-roles)
9. [Technology Stack](#-technology-stack)
10. [System Architecture](#-system-architecture)
11. [Project Folder Structure](#-project-folder-structure)
12. [Algorithms and Technical Implementation](#-algorithms-and-technical-implementation)
13. [Database Design](#-database-design)
14. [Installation and Setup](#-installation-and-setup)
15. [Supabase Configuration](#-supabase-configuration)
16. [Running the Application](#-running-the-application)
17. [Deployment](#-deployment)
18. [Testing and Verification](#-testing-and-verification)
19. [Limitations](#-limitations)
20. [Future Enhancements](#-future-enhancements)
21. [Academic Project Information](#-academic-project-information)

---

## 1. 📖 Project Overview

During natural disasters such as floods, cyclones, earthquakes, fires and other humanitarian emergencies, affected communities require immediate access to essential resources such as:

- Food and drinking water
- Medicines and medical equipment
- Clothing
- Temporary shelter
- Transportation
- Rescue and emergency assistance

However, information about emergency requirements, available resources, donors and volunteers is often scattered across different organizations.

ResQLink addresses this challenge by providing a centralized digital platform where emergency requests can be submitted, available resources can be registered, volunteers can be managed and suitable allocations can be recommended.

The platform aims to make emergency response more organized, transparent and efficient.

## 2. ⚠️ Problem Statement

Emergency relief coordination commonly faces three major challenges:

**1. Information Asymmetry**

NGOs, donors and emergency response organizations often lack a centralized system to share information about urgent requirements and available resources.

**2. Lack of Automated Prioritization**

Emergency requests may be handled in the order they are received rather than according to urgency, severity and the number of people affected.

**3. Inefficient Geographical Allocation**

Resources and volunteers may be assigned from distant locations even when suitable alternatives are available nearby, resulting in unnecessary delays.

ResQLink aims to address these problems through centralized information management and algorithm-based allocation recommendations.

## 3. 🎯 Project Objectives

The primary objectives are:

- Develop a centralized emergency resource coordination platform.
- Allow NGOs to submit and monitor emergency requests.
- Enable donors to register and manage available resources.
- Maintain volunteer profiles, skills and availability.
- Automatically calculate emergency priority scores.
- Calculate geographical distances between requests, resources and volunteers.
- Recommend suitable resource and volunteer combinations.
- Prevent duplicate resource allocation and inventory inconsistencies.
- Provide an interactive geographical map.
- Improve transparency through request and allocation status tracking.

## 4. 💡 Proposed Solution

ResQLink provides an integrated emergency coordination system.

The application follows this process:

1. An NGO submits an emergency request with its location, resource requirement, quantity and urgency.
2. The system calculates a priority score.
3. Available resources are filtered according to resource type, stock and availability.
4. Suitable resources are ranked according to geographical distance.
5. Available volunteers are evaluated according to skills, vehicles and proximity.
6. The system generates allocation recommendations.
7. An administrator reviews and approves the proposed allocation.
8. Inventory, volunteer availability and request status are updated.
9. The mission can be marked as completed after delivery.

---

## 5. ✨ Key Features

### Emergency Request Management
- Submit emergency requirements.
- Specify resource category and quantity.
- Enter affected population and urgency.
- Record geographical coordinates.
- View request priority and current status.

### Resource Management
- Register available relief resources.
- Manage resource categories and quantities.
- Monitor inventory availability.
- Track resource allocation.
- Prevent allocation beyond available stock.

### Volunteer Management
- Maintain volunteer profiles.
- Record skills and competencies.
- Store vehicle and transportation information.
- Monitor availability status.
- Track assigned missions.

### Smart Matching and Allocation
- Identify suitable resources.
- Rank resource depots by distance.
- Match volunteers according to skills.
- Consider volunteer availability and proximity.
- Generate transparent allocation recommendations.
- Support administrator approval.

### Priority Management
Requests are categorized into:

- 🔴 Critical
- 🟠 High
- 🟡 Medium
- 🟢 Low

### Interactive Map
- Display emergency request locations.
- Show resource depot locations.
- Display volunteer locations.
- Use different markers for different categories.
- Visualize geographical distances.

### Dashboard and Monitoring
- Display emergency statistics.
- Monitor pending and completed requests.
- View resource availability.
- Track volunteer activity.
- Monitor allocation operations.

---

## 6. 🧩 System Modules

| Module | Description |
|---|---|
| Authentication and Role Selection | Provides role-based demo access. |
| Emergency Request Module | Handles emergency request creation and tracking. |
| Resource Management | Maintains available inventory and stock. |
| Volunteer Management | Manages volunteer details, skills and availability. |
| Priority Calculation | Calculates urgency scores for requests. |
| Distance Calculation | Computes geographical distances. |
| Smart Allocation | Recommends suitable resource and volunteer assignments. |
| Admin Dashboard | Provides centralized operational monitoring. |
| Map Visualization | Displays requests, resources and volunteers geographically. |

---

## 7. 🔄 System Workflow

```text
             USERS
               |
               ▼
       ROLE SELECTION
               |
               ▼
      NGO SUBMITS REQUEST
               |
               ▼
      PRIORITY CALCULATION
               |
               ▼
       RESOURCE FILTERING
               |
               ▼
      DISTANCE CALCULATION
               |
               ▼
      VOLUNTEER MATCHING
               |
               ▼
      ALLOCATION PROPOSAL
               |
               ▼
      ADMIN APPROVAL
               |
               ▼
      RESOURCE INVENTORY
           UPDATED
               |
               ▼
       VOLUNTEER ASSIGNED
               |
               ▼
       MISSION COMPLETED
```

---

## 8. 👥 User Roles

ResQLink provides four role-based demonstration dashboards.

### 1. NGO
- Submit emergency requests.
- Specify resource requirements.
- Enter emergency location.
- Monitor request priority.
- Track delivery status.

### 2. Donor
- Register available resources.
- Update inventory quantities.
- Manage resource availability.
- Monitor allocation and dispatch status.

### 3. Volunteer
- View assigned missions.
- Review transportation requirements.
- Accept or decline tasks.
- Update availability.
- Mark completed deliveries.

### 4. Administrator
- Monitor overall emergency operations.
- View requests and available resources.
- Trigger matching recommendations.
- Review allocation proposals.
- Approve or reject allocations.
- Monitor system-wide statistics.

**Note:** The current academic demonstration uses simulated role selection rather than production-grade authentication. It is intended for project evaluation and demonstration.

---

## 9. 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend library and component-based UI |
| Vite | Frontend development and build tool |
| JavaScript (ESNext) | Application logic and interactions |
| HTML5 | Web page structure |
| CSS3 | Styling and responsive layouts |
| Tailwind CSS | Utility-based styling |
| React Router DOM | Client-side navigation |
| Lucide React | Interface icons |
| Leaflet | Interactive geographical maps |
| React-Leaflet | React integration for Leaflet |
| OpenStreetMap | Map tile provider |
| Supabase | Backend services and database |
| PostgreSQL | Relational database |
| Git and GitHub | Version control and collaboration |
| Google Antigravity | AI-assisted development environment |
| Vercel | Application deployment and hosting |

---

## 10. 🏗️ System Architecture

ResQLink follows a frontend, backend-service and database architecture.

```text
              USERS
                 |
                 ▼
          REACT FRONTEND
                 |
        ┌────────┴─────────┐
        |                  |
        ▼                  ▼
   SUPABASE SERVICES    ALLOCATION LOGIC
        |                  |
        ▼                  |
   POSTGRESQL DATABASE     |
        |                  |
        └────────┬─────────┘
                 |
                 ▼
         APPLICATION OUTPUT
                 |
       ┌─────────┼──────────┐
       ▼         ▼          ▼
    REQUESTS  RESOURCES  VOLUNTEERS
                 |
                 ▼
          MAP AND DASHBOARD
```

The frontend handles user interaction and presentation. Supabase provides database and backend services, while the allocation logic processes requests and generates recommendations.

---

## 11. 📁 Project Folder Structure

```text
ResQLink/
│
├── frontend/
│   ├── src/
│   │   ├── algorithms/
│   │   │   ├── priority.js
│   │   │   ├── distance.js
│   │   │   └── allocation.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── RequestForm.jsx
│   │   │   ├── ResourceForm.jsx
│   │   │   ├── MatchingModal.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── LoadingState.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── lib/
│   │   │   └── supabase.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── NGODashboard.jsx
│   │   │   ├── DonorDashboard.jsx
│   │   │   ├── VolunteerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Requests.jsx
│   │   │   ├── Resources.jsx
│   │   │   ├── Volunteers.jsx
│   │   │   ├── Allocations.jsx
│   │   │   └── MapPage.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── mockData.js
│   │   │   ├── storageAdapter.js
│   │   │   ├── requestService.js
│   │   │   ├── resourceService.js
│   │   │   ├── volunteerService.js
│   │   │   └── allocationService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   └── supabase/
│       ├── schema.sql
│       └── seed.sql
│
├── .gitignore
├── vercel.json
└── README.md
```

---

## 12. 🧠 Algorithms and Technical Implementation

The major technical highlight of ResQLink is its algorithm-based emergency allocation system.

### A. Priority Calculation Algorithm

File: `frontend/src/algorithms/priority.js`

The system calculates a priority score using urgency and the number of affected people.

**Formula:**

```text
Priority Score =
(Urgency × 20) +
(Minimum of People Affected and 100 × 0.5)
```

Urgency is measured on a scale of 1 to 5.

People affected contribute 0.5 points per person, with a maximum contribution of 50 points.

**Priority categories:**

| Score | Priority |
|---|---|
| 85 and above | Critical |
| 65 to below 85 | High |
| 40 to below 65 | Medium |
| Below 40 | Low |

Maximum theoretical score: 150.

This approach helps identify requests that require immediate attention.

### B. Haversine Distance Algorithm

File: `frontend/src/algorithms/distance.js`

The Haversine formula calculates the approximate great-circle distance between two geographical coordinates on Earth.

It is used to compare the locations of:

- Emergency requests.
- Resource depots.
- Volunteers.

The formula is:

```text
a = sin²(Δlat / 2)
    + cos(lat1) × cos(lat2)
    × sin²(Δlon / 2)

c = 2 × atan2(√a, √(1-a))

Distance = R × c
```

Where:

- R = 6371.0088 km (mean Earth radius).
- Latitude and longitude are converted into radians.
- The final distance is expressed in kilometers.

### C. Multi-Criteria Greedy Matching Algorithm

File: `frontend/src/algorithms/allocation.js`

The matching system identifies suitable resources and volunteers for an emergency request.

The process involves:

1. Filtering resources according to the required resource category.
2. Excluding unavailable or depleted resources.
3. Checking whether sufficient inventory exists.
4. Calculating distances between the request and resource depots.
5. Ranking eligible resources by proximity.
6. Identifying volunteer skills required for the resource category.
7. Filtering volunteers according to availability and skills.
8. Ranking suitable volunteers according to distance and transportation capabilities.
9. Generating explanations for matching and exclusion decisions.

**Example skill mapping:**

| Resource category | Relevant volunteer skills |
|---|---|
| Medicine | Medical assistance, Transportation |
| Food and Water | Food distribution, Transportation, Logistics |
| Shelter | Rescue support, Logistics, General assistance |

The algorithm aims to recommend a suitable combination of available resources and volunteers.

### D. Atomic Allocation and Data Integrity

File: `backend/supabase/schema.sql`

The database includes an allocation approval procedure designed to maintain inventory consistency.

Its responsibilities include:

- Locking the allocation record during approval.
- Checking available resource quantity.
- Deducting allocated stock.
- Updating resource status when stock becomes depleted.
- Updating the emergency request status.
- Updating volunteer availability.
- Changing the allocation status to approved.

This helps prevent duplicate allocation and inventory conflicts.

---

## 13. 🗄️ Database Design

ResQLink uses Supabase PostgreSQL for persistent data management.

The database schema includes the data required for:

- User and role management.
- Emergency requests.
- Resource inventory.
- Volunteer information.
- Allocation records.

The SQL implementation includes relational constraints, indexes, Row Level Security policies and stored procedures.

Database files:

```text
backend/
└── supabase/
    ├── schema.sql
    └── seed.sql
```

The `schema.sql` file defines the database structure and allocation-related procedures.

The `seed.sql` file inserts fictional sample records for demonstration.

---

## 14. 💻 Installation and Setup

### Prerequisites

Install the following:

- Node.js v18 or higher.
- npm v9 or higher.
- Git.
- Visual Studio Code (recommended).

### Step 1: Clone the repository

```bash
git clone https://github.com/ishitasingh16/resqlink.git
```

### Step 2: Open the project directory

```bash
cd resqlink
```

### Step 3: Navigate to the frontend

```bash
cd frontend
```

### Step 4: Install dependencies

```bash
npm install
```

---

## 15. 🔑 Supabase Configuration

To connect the application to a Supabase database:

### Step 1: Create a Supabase project

Visit:

https://supabase.com

Create a new project.

### Step 2: Configure the database

Open the Supabase SQL Editor.

Execute:

```text
backend/supabase/schema.sql
```

This creates the required database tables, constraints, indexes, security policies and stored procedures.

### Step 3: Insert demonstration data

Execute:

```text
backend/supabase/seed.sql
```

This inserts fictional emergency requests, resources, volunteers and allocations.

### Step 4: Configure environment variables

Copy the environment example file:

```bash
cp .env.example .env
```

Add your Supabase project credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co

VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Restart the development server after configuring the environment variables.

**Security Note:** Never expose a Supabase service-role key in frontend code or commit private credentials to GitHub. Configure appropriate database security policies before using real data.

---

## 16. ▶️ Running the Application

From the frontend directory, execute:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Open that URL in your browser.

### Demo Mode

If Supabase credentials are not configured, the application supports a demonstration mode using sample data and local persistence.

This allows users to explore the main workflows without connecting a live database.

---

## 17. 🚀 Deployment

ResQLink is configured for deployment through Vercel.

### Deployment using GitHub

1. Push the project code to GitHub.
2. Visit https://vercel.com
3. Sign in using GitHub.
4. Select Add New → Project.
5. Import the ResQLink repository.
6. Configure the project build settings according to `vercel.json`.
7. Add the required Supabase environment variables if using the live database.
8. Click Deploy.

The repository includes `vercel.json` with configuration for the frontend build and single-page application routing.

Vercel generates a public deployment URL after a successful build.

---

## 18. 🧪 Testing and Verification

The following areas should be tested before project evaluation.

| Test Area | Expected Result |
|---|---|
| Application Build | Vite build completes successfully |
| Role Selection | Users can switch between demonstration roles |
| Emergency Requests | Requests can be submitted and tracked |
| Priority Calculation | Correct priority score and category |
| Distance Calculation | Accurate geographical distance |
| Resource Management | Inventory quantity and availability update correctly |
| Volunteer Management | Skills and availability are maintained |
| Smart Matching | Suitable resources and volunteers are recommended |
| Allocation Approval | Stock and request status are updated consistently |
| Map Visualization | Requests, resources and volunteers appear on the map |
| Demo Data Reset | Application returns to its initial sample state |

Run the production build test:

```bash
npm run build
```

---

## 19. ⚠️ Limitations

ResQLink is an academic prototype and has the following limitations:

- Role-based access is simulated for demonstration rather than implemented using production-grade authentication.
- Geographical coordinates in the sample dataset are synthetic.
- The matching system uses greedy proximity-based optimization rather than advanced global optimization methods.
- Road-network routing and real-time traffic information are not currently included.
- Demonstration data should not be treated as verified emergency information.
- The prototype is not intended to replace official emergency response systems.

---

## 20. 🔮 Future Enhancements

Possible future improvements include:

1. **Real-Time Emergency Notifications:** Integrate SMS and WhatsApp notifications using services such as Twilio.

2. **Advanced Authentication:** Implement Supabase Auth with secure role-based access.

3. **Road-Network Routing:** Integrate OpenRouteService or OSRM for practical route estimation and navigation.

4. **Machine Learning-Based Demand Prediction:** Analyze historical emergency data to estimate future resource requirements.

5. **Advanced Optimization:** Explore optimization methods such as the Hungarian Algorithm, Mixed-Integer Linear Programming and vehicle-routing algorithms.

6. **Multiple Resource Allocation:** Support splitting large requirements across multiple resource depots.

7. **Live Location Tracking:** Enable real-time tracking of volunteer and delivery locations.

8. **Scalable Emergency Coordination:** Extend the platform to support multiple NGOs and disaster-response organizations.

---

## 21. 🎓 Academic Project Information

**Project Name:** ResQLink

**Project Title:** Intelligent Emergency Resource Allocation and Volunteer Coordination Platform

**Project Type:** Full-Stack Web Application

**Degree:** Bachelor of Technology (B.Tech)

**Specialization:** Computer Science and Engineering – Artificial Intelligence and Machine Learning

**Academic Year:** 2026

**Repository:** https://github.com/ishitasingh16/resqlink

**Development Tools:** Google Antigravity, Visual Studio Code and GitHub

**Deployment Platform:** Vercel

---

## 📜 License

This project is intended for academic and educational purposes.

The repository specifies the MIT License. Refer to the project's license file for the applicable terms.

---

## ❤️ Project Vision

**Connecting Help. Saving Time.**

ResQLink aims to make emergency relief coordination more organized by bringing requests, resources and volunteers together through technology and intelligent allocation.

Every resource matters. Every minute matters. Every life matters.