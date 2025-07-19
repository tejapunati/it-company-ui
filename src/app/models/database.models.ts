// User model
export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // Can be 'USER', 'ADMIN', 'PARENT_ADMIN' or lowercase versions
  department?: string;
  phone?: string;
  status: string; // Can be 'ACTIVE', 'INACTIVE', 'PENDING' or lowercase versions
  createdDate: string;
  lastLogin?: string;
}

// Timesheet model
export interface Timesheet {
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

// Email model
export interface Email {
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

// Activity model
export interface Activity {
  id: number;
  userId: number;
  action: string;
  description: string;
  type: 'user' | 'timesheet' | 'approval' | 'admin';
  timestamp: number;
  metadata?: any;
}

// Dashboard stats model
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  totalTimesheets: number;
  approvedHours: number;
  pendingTimesheets: number;
  emailsSent: number;
  lastUpdated: number;
}

// Authentication response model
export interface AuthResponse {
  userId: number;
  email: string;
  name: string;
  role: string; // Can be 'USER', 'ADMIN', 'PARENT_ADMIN' or lowercase versions
  token: string;
  expiresIn: number;
}

// Registration request model
export interface RegistrationRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  department?: string;
  role?: 'user' | 'admin' | 'parent-admin';
}

// Login request model
export interface LoginRequest {
  email: string;
  password: string;
  role: string;
}