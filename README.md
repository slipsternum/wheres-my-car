# Where's My Car? 🚗

A modern, family-friendly parking tracker application designed to help you and your family remember exactly where you parked. Built with React 19, Vite, and Node.js.

## ✨ Features

- **Multi-Car Support:** Track multiple vehicles (SUV, Sedan, Hatchback, Truck, Sports Car) with custom names and colors.
- **Visual Parking Grid:** Easy-to-use interface for selecting parking spots based on floors and sections (e.g., "Level 2, Section B").
- **Live Status:** Real-time updates on car location, parking time, and the driver who parked it.
- **User Identity & Magic Links:**
  - Secure, key-based access for family members.
  - Shareable "Magic Links" for one-tap login.
- **Admin Panel:**
  - **Root Admin:** Password-protected master access.
  - **User Management:** Create and revoke user access keys.
  - **Fleet Management:** Add, edit, or remove vehicles.
  - **Facility Layout:** Customize floors and zones.
- **Responsive Design:** Mobile-first UI with smooth animations and "faux-3D" vector graphics.
- **Dual Modes:**
  - **Full Stack:** Node.js backend with JSON persistence.
  - **Demo Mode:** Client-side only (LocalStorage) for testing.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Lucide React
- **Backend:** Node.js, Express
- **Storage:** JSON file-based persistence (backend mode) or LocalStorage (demo mode)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/slipsternum/wheres-my-car.git
   cd wheres-my-car
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the Application

To run the full stack (Frontend + Backend):

1. **Start the Backend Server:**
   This server manages the `db.json` database.
   ```bash
   npm run server
   ```
   *Server runs on `http://localhost:3000` by default.*

2. **Start the Frontend Development Server:**
   In a new terminal window:
   ```bash
   npm run dev
   ```
   *Frontend runs on `http://localhost:5173` by default.*

### Building for Production

To build the frontend for production deployment:
```bash
npm run build
```
The backend server is configured to serve the static files from the `dist` directory if you access it directly.

## ⚙️ Configuration

Create a `.env` file in the root directory to configure the application.

**Example `.env`:**
```env
# Frontend Config
VITE_DEMO_MODE=false            # Set to 'true' to run without backend (LocalStorage only)
VITE_ADMIN_PASSWORD=admin123    # Master password to unlock the Admin Panel

# Backend Config (Optional)
PORT=3000                       # Server port
DB_FILE=data/db.json            # Path to the JSON database file

# Deployment Config (Optional)
VITE_APP_BASE_URL=/             # App base path (e.g. /wheres-my-car/) if sub-folder
```

## 🔐 Security & Authentication

This application uses a **Key-Based Authentication** system tailored for trusted family environments.

### 1. User Keys (Magic Links)
- Users are granted access via unique **API Keys**.
- The Admin can generate these keys in the Admin Panel.
- **Usage:** Users receive a "Magic Link" (e.g., `/?key=abc123...&user=Mom`) which automatically logs them in and saves their credentials.
- **Revocation:** Deleting a user in the Admin Panel immediately invalidates their key. The next time they try to use the app, their session will be cleared.

### 2. Root Admin
- There is one "Master Password" defined by `VITE_ADMIN_PASSWORD` in the `.env` file.
- Entering this password in the Admin Panel grants **Root Access**.
- Internally, this generates a special Root Key that bypasses the user list check.

### ⚠️ Security Note
While secure enough for private home servers, this application is **not designed for public internet exposure** without a reverse proxy (like Nginx) handling HTTPS. API keys are sent in headers/URL parameters and could be intercepted on public usage if not using SSL.

## 📱 Usage Guide

1.  **Dashboard:** View the status of all family cars.
2.  **Parking:** Tap a car card to open the parking grid. Select a spot (e.g., "B2") to save.
3.  **Settings (Admin):**
    - Tap the gear icon.
    - **Identity:** Set your display name.
    - **Admin Unlock:** Enter the master password to manage users, vehicles, and layout.
4.  **Shortcuts:**
    - `/?user=Name`: Sets user identity.
    - `/?car=c1`: Opens parking grid for specific car.

## 📡 API Endpoints

The Node.js backend provides a REST API:

- `GET /api/config` - Retrieve global configuration.
- `POST /api/config` - Update configuration.
- `GET /api/status` - Retrieve parking status.
- `POST /api/park` - Update parking status.
- `GET/POST/DELETE /api/users` - Manage user access keys.

## 📁 Project Structure

```
wheres-my-car/
├── data/               # Persistent storage (db.json)
├── public/             # Static assets
├── src/
│   ├── components/     # UI Components (Dashboard, Admin, ParkInterface)
│   ├── services/       # API wrapper & Auth logic
│   ├── App.jsx         # Main Controller
│   ├── constants.js    # Config constants
│   └── main.jsx        # Entry point
├── server.js           # Express Backend & Middleware
└── vite.config.js      # Vite Config
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
