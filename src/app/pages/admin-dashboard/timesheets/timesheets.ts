import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ ADD THIS


@Component({
  standalone: true,
  selector: 'app-timesheets',
  imports: [CommonModule, FormsModule], // ✅ INCLUDE FOR ngModel
  templateUrl: './timesheets.html',
  styleUrls: ['./timesheets.css']
})
export class TimesheetsComponent implements OnInit {
  timesheets: any[] = []; // Replace with your actual timesheet data type
  uniqueUsers: string[] = [];
  selectedUser: string = '';
  filteredTimesheets: any[] = [];

  ngOnInit() {
    // TODO: Load your timesheets data here
    // Example:
    // this.timesheets = [{ user: 'Alice', week: '2024-W23', hours: 40 }, ...];

    this.updateUniqueUsers();
    this.filterTimesheets();
  }

  updateUniqueUsers() {
    this.uniqueUsers = Array.from(new Set(this.timesheets.map(ts => ts.user)));
  }

  filterTimesheets() {
    if (!this.selectedUser) {
      this.filteredTimesheets = this.timesheets;
    } else {
      this.filteredTimesheets = this.timesheets.filter(ts => ts.user === this.selectedUser);
    }
  }
}
