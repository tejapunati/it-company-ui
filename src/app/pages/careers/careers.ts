import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css']
})
export class CareersComponent {
  selectedCategory = '';
  selectedType = '';
  selectedLocation = '';
  searchKeyword = '';

  jobList = [
    { title: 'UI/UX Designer', category: 'Design', type: 'Full-Time', location: 'Hyderabad' },
    { title: 'Mobile Developer', category: 'Development', type: 'Contract', location: 'Remote' },
    { title: 'QA Tester', category: 'Testing', type: 'Full-Time', location: 'Chicago' },
    { title: 'Graphic Designer', category: 'Design', type: 'Part-Time', location: 'Hyderabad' }
  ];

  get filteredJobs() {
    return this.jobList.filter(job =>
      (!this.searchKeyword || job.title.toLowerCase().includes(this.searchKeyword.toLowerCase())) &&
      (!this.selectedCategory || job.category === this.selectedCategory) &&
      (!this.selectedType || job.type === this.selectedType) &&
      (!this.selectedLocation || job.location === this.selectedLocation)
    );
  }
}
