import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  category: string;
  description: string;
}

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './careers.html',
  styleUrls: ['./careers.css']
})
export class CareersComponent implements OnInit {
  searchKeyword: string = '';
  selectedCategory: string = '';
  selectedType: string = '';
  selectedLocation: string = '';
  
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  
  ngOnInit() {
    // Mock data - in a real app, this would come from a service
    this.jobs = [
      {
        id: 1,
        title: 'Senior Full Stack Developer',
        type: 'Full-Time',
        location: 'Chicago',
        category: 'Development',
        description: 'Experienced developer needed for complex web applications using modern JavaScript frameworks and backend technologies.'
      },
      {
        id: 2,
        title: 'UX/UI Designer',
        type: 'Full-Time',
        location: 'Remote',
        category: 'Design',
        description: 'Creative designer with experience in creating intuitive user interfaces and exceptional user experiences.'
      },
      {
        id: 3,
        title: 'QA Engineer',
        type: 'Contract',
        location: 'Hyderabad',
        category: 'Testing',
        description: 'Detail-oriented tester to ensure software quality through manual and automated testing procedures.'
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        type: 'Full-Time',
        location: 'Chicago',
        category: 'Development',
        description: 'Experienced in CI/CD pipelines, containerization, and cloud infrastructure management.'
      },
      {
        id: 5,
        title: 'Project Manager',
        type: 'Full-Time',
        location: 'New York',
        category: 'Management',
        description: 'Experienced project manager to lead technical teams and ensure successful project delivery.'
      },
      {
        id: 6,
        title: 'Mobile App Developer',
        type: 'Part-Time',
        location: 'Remote',
        category: 'Development',
        description: 'Developer with experience in native and cross-platform mobile application development.'
      }
    ];
    
    this.filteredJobs = [...this.jobs];
  }
  
  onFilterChange() {
    this.filteredJobs = this.jobs.filter(job => {
      // Filter by search keyword
      const keywordMatch = this.searchKeyword ? 
        job.title.toLowerCase().includes(this.searchKeyword.toLowerCase()) : 
        true;
      
      // Filter by category
      const categoryMatch = this.selectedCategory ? 
        job.category === this.selectedCategory : 
        true;
      
      // Filter by type
      const typeMatch = this.selectedType ? 
        job.type === this.selectedType : 
        true;
      
      // Filter by location
      const locationMatch = this.selectedLocation ? 
        job.location === this.selectedLocation : 
        true;
      
      return keywordMatch && categoryMatch && typeMatch && locationMatch;
    });
  }
}