# Badminton Court Booking System

A full-stack application for managing badminton court bookings, equipment rentals, and coach reservations. The system features dynamic pricing driven by configurable rules stored in the database (peak hours, weekends, court type) and an admin interface for managing resources.

## Deployment

- **Live Demo:** [https://badminton-court-booking-system-two.vercel.app/](https://badminton-court-booking-system-two.vercel.app/) *(Frontend)*
- **API Base URL:** [https://badminton-booking-backend-a0zs.onrender.com/](https://badminton-booking-backend-a0zs.onrender.com/) *(Backend)*

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, Prisma ORM
- **Frontend:** React, Vite, TailwindCSS
- **Database:** PostgreSQL

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL (local or cloud, e.g. Prisma Postgres)  

## Setup Instructions

### 1. Database Setup

Ensure your PostgreSQL server is running. Create a database for the project (e.g., `badminton_db`).

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory using `.env.example` as a reference (adjust credentials as needed):  
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/badminton_db?schema=public"
   PORT=3000
   JWT_SECRET="your_super_secret_key"
   ```

4. Run database migrations to set up the schema:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed the database** with initial data (Courts, Equipment, Coaches, Pricing Rules, Users):
   ```bash
   npx prisma db seed
   ```
   *Note: This creates a default Admin user (`admin@badminton.com` / `admin123`) and a standard User (`user@badminton.com` / `user123`). (Passwords are hashed during seeding).*

6. Start the backend server:
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:3000`.

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Access the application at `http://localhost:5173` (or the port shown in your terminal).

## Key Features

- **Multi-Resource Booking:** Book courts, equipment, and coaches in a single transaction.
- **Dynamic Pricing:** Automatic calculation of costs based on peak hours (6-9 PM), weekends, and facility type.
- **Admin Dashboard:** Manage courts, equipment inventory, and coach availability.
- **Conflict Prevention:** Checks availability for all selected resources before confirming.

## Assumptions

- Operating hours are fixed for simplicity (e.g., 6 AM - 11 PM).
- "Peak Hours" are strictly defined by the Admin configuration.
- Payments are simulated (no real payment gateway integration).
- Pricing rules are stored in the database and seeded initially; an admin UI for modifying pricing rules can be added on top of the existing schema.  

