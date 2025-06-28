// src/app/pages/admin-approval/admin-approval.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-approval.html',
  styleUrls: ['./admin-approval.css'],
})
export class AdminApprovalComponent {
  pendingAdmins = [
    // Example data, replace with actual data fetched from a service
    { id: 1, name: 'Admin One', email: 'admin1@example.com', status: 'Pending' },
    { id: 2, name: 'Admin Two', email: 'admin2@example.com', status: 'Pending' }
  ];

  // Make sure these methods exist and are correctly named
  approveAdmin(adminId: number) {
    console.log(`Approving admin: ${adminId}`);
    // Implement approval logic, e.g., call a service to update status
    const adminToUpdate = this.pendingAdmins.find(admin => admin.id === adminId);
    if (adminToUpdate) {
      adminToUpdate.status = 'Approved';
      // In a real application, you'd send this update to a backend service.
    }
  }

  rejectAdmin(adminId: number) {
    console.log(`Rejecting admin: ${adminId}`);
    // Implement rejection logic
    const adminToUpdate = this.pendingAdmins.find(admin => admin.id === adminId);
    if (adminToUpdate) {
      adminToUpdate.status = 'Rejected';
      // In a real application, you'd send this update to a backend service.
    }
  }
}