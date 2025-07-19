# Connecting Frontend to Backend

This document provides instructions on how to connect the Angular frontend to your backend API for user/admin/parent-admin authentication and dashboard data.

## Backend Requirements

Your backend should provide the following API endpoints:

### Authentication Endpoints

- `POST /api/auth/login`: Authenticate users
- `POST /api/auth/register`: Register new users
- `POST /api/auth/admin-register`: Register new admin users
- `POST /api/auth/logout`: Logout users

### User Management Endpoints

- `GET /api/users`: Get all users
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user

### Timesheet Management Endpoints

- `GET /api/timesheets`: Get all timesheets
- `GET /api/timesheets/:id`: Get timesheet by ID
- `GET /api/timesheets/user/:userId`: Get timesheets by user ID
- `POST /api/timesheets`: Create a new timesheet
- `PUT /api/timesheets/:id`: Update a timesheet

### Email Management Endpoints

- `GET /api/emails`: Get all emails
- `POST /api/emails`: Send a new email

### Activity Tracking Endpoints

- `GET /api/activities`: Get all activities
- `GET /api/activities/user/:userId`: Get activities by user ID
- `POST /api/activities`: Log a new activity

### Dashboard Stats Endpoints

- `GET /api/stats`: Get dashboard statistics

## Database Schema

The frontend expects the following data models from the backend:

### User

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'parent-admin';
  department?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  createdDate: string;
  lastLogin?: string;
}
```

### Timesheet

```typescript
interface Timesheet {
  id: number;
  userId: number;
  employeeName: string;
  employeeEmail: string;
  weekEnding: string;
  hours: { [key: string]: number }; // e.g., { "Monday": 8, "Tuesday": 8, ... }
  totalHours: number;
  comments: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: number;
}
```

### Email

```typescript
interface Email {
  id: number;
  to: string;
  from: string;
  subject: string;
  body: string;
  type: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: number;
  readAt?: number;
}
```

### Activity

```typescript
interface Activity {
  id: number;
  userId: number;
  action: string;
  description: string;
  type: 'user' | 'timesheet' | 'approval' | 'admin';
  timestamp: number;
  metadata?: any;
}
```

### Dashboard Stats

```typescript
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  totalTimesheets: number;
  approvedHours: number;
  pendingTimesheets: number;
  emailsSent: number;
  lastUpdated: number;
}
```

## Authentication Flow

1. User submits login form with email, password, and role
2. Frontend sends request to `/api/auth/login`
3. Backend validates credentials and returns user data with JWT token
4. Frontend stores token in localStorage and updates user state
5. All subsequent API requests include the JWT token in the Authorization header

## Configuration

The API URL is configured in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Update this URL to match your backend API endpoint.

## Running the Application

1. Start your backend server
2. Run the Angular application:

```bash
ng serve
```

3. Navigate to `http://localhost:4200` in your browser

## Building for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/it-company-ui` directory.