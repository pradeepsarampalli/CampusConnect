# CampusConnect

A full-stack college event and notice management platform built with the MERN stack. CampusConnect gives students, organizers, and admins a single place to manage campus events, publish notices, handle registrations, and coordinate volunteers.

---

## Features

- **Role-based access** — three roles: `user`, `organizer`, and `admin`, each with a dedicated dashboard and guarded routes
- **Event management** — organizers can create, update, and delete events; users can browse and register
- **QR code tickets** — registered users receive a QR code for their event registration
- **Volunteer system** — users can apply as volunteers for events; organizers can review and update application status
- **Notices board** — publish and view campus announcements
- **Calendar view** — visualize upcoming events on a calendar
- **Authentication** — JWT stored in httpOnly cookies with bcrypt password hashing
- **Settings & profile** — users can update their name and avatar URL

---

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JSON Web Tokens (JWT) + bcrypt
- QRCode generation
- cookie-parser, dotenv, cors

**Frontend**
- React 19
- React Router v7
- Lucide React + React Icons
- Custom CSS (no UI framework)

---

## Project Structure

```
CampusConnect/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route logic (events, notices, users, stats)
│   ├── middlewares/     # authCheck, adminOnly, organizerOrAdmin
│   ├── models/          # Mongoose schemas (User, Event, Notice, EventRegistration, VolunteerApplication)
│   ├── routes/          # Express routers
│   ├── app.js
│   └── server.js
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Layout, CalendarDateModal, Settings components
        ├── context/     # UserContext (global auth state)
        ├── css/         # Page-level stylesheets
        ├── data/        # Static calendar data
        ├── hooks/       # useStat custom hook
        ├── pages/       # AdminDashboard, OrganizerDashboard, UserDashboard, Events, Notices, etc.
        └── routes/      # AppRoutes with role guards
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/pradeepsarampalli/CampusConnect.git
cd CampusConnect
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm start
```

The React app runs on `http://localhost:3000` and proxies API requests to `${API_BASE_URL}`.

---

## API Overview

All protected routes require a valid JWT cookie set at login.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/signin` | Public | Login and receive JWT cookie |
| GET | `/api/auth/signOut` | Public | Clear JWT cookie |
| GET | `/api/auth/me` | Auth | Get current user info |
| GET | `/api/events` | Auth | List all events |
| POST | `/api/events` | Organizer/Admin | Create an event |
| PUT | `/api/events/:id` | Organizer/Admin | Update an event |
| DELETE | `/api/events/:id` | Organizer/Admin | Delete an event |
| POST | `/api/events/:id/register` | Auth | Register for an event |
| GET | `/api/events/:id/my-qr` | Auth | Get QR code for registration |
| POST | `/api/events/:id/volunteer` | Auth | Apply as a volunteer |
| GET | `/api/notices` | Auth | List all notices |
| GET | `/api/admin/getStats` | Auth | Get platform statistics |

---

## User Roles

| Role | Capabilities |
|------|-------------|
| `user` | Browse events and notices, register for events, apply as volunteer, view QR ticket |
| `organizer` | All user capabilities + create/edit/delete own events, manage registrations and volunteer applications |
| `admin` | All organizer capabilities + access admin dashboard, view all users and stats |

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
