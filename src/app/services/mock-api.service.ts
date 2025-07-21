import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  
  // Mock services data
  getServices(): Observable<any[]> {
    return of([
      {
        title: 'IT Staffing',
        icon: '<i class="fas fa-users"></i>',
        description: 'Connect with top tech talent across all technology domains to power your digital innovation.'
      },
      {
        title: 'Software Development',
        icon: '<i class="fas fa-code"></i>',
        description: 'Custom software solutions designed to meet your specific business requirements and challenges.'
      },
      {
        title: 'Cloud Services',
        icon: '<i class="fas fa-cloud"></i>',
        description: 'Comprehensive cloud solutions for scalable, secure, and resilient infrastructure.'
      },
      {
        title: 'IT Consulting',
        icon: '<i class="fas fa-chart-line"></i>',
        description: 'Strategic technology guidance to optimize your IT infrastructure and drive business growth.'
      }
    ]);
  }
  
  // Mock technologies data
  getTechnologies(): Observable<any[]> {
    return of([
      {
        name: 'Web Development',
        icon: '<i class="fas fa-laptop-code"></i>',
        tags: ['React', 'Angular', 'Node.js', 'Vue', 'Next.js']
      },
      {
        name: 'Cloud Computing',
        icon: '<i class="fas fa-cloud"></i>',
        tags: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker']
      },
      {
        name: 'Data Science',
        icon: '<i class="fas fa-chart-bar"></i>',
        tags: ['Python', 'TensorFlow', 'PyTorch', 'Big Data', 'ML']
      }
    ]);
  }
  
  // Mock industries data
  getIndustries(): Observable<any[]> {
    return of([
      {
        name: 'Information Technology',
        icon: '<i class="fas fa-desktop"></i>'
      },
      {
        name: 'Finance & Banking',
        icon: '<i class="fas fa-landmark"></i>'
      },
      {
        name: 'Healthcare',
        icon: '<i class="fas fa-hospital"></i>'
      },
      {
        name: 'Manufacturing',
        icon: '<i class="fas fa-industry"></i>'
      }
    ]);
  }
  
  // Mock stats data
  getStats(): Observable<any[]> {
    return of([
      { value: '500+', label: 'Successful Projects', offset: '0' },
      { value: '95%', label: 'Client Satisfaction', offset: '14' },
      { value: '200+', label: 'Partner Companies', offset: '113' },
      { value: '10+', label: 'Years Experience', offset: '198' }
    ]);
  }
  
  // Mock testimonials data
  getTestimonials(): Observable<any[]> {
    return of([
      {
        quote: 'SSRM Tech helped us find the perfect development team in record time. Their understanding of our technical needs was impressive.',
        name: 'Michael Johnson',
        title: 'CTO, TechInnovate',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        quote: 'The quality of candidates provided by SSRM Tech was exceptional. They truly understand the tech industry and its unique requirements.',
        name: 'Sarah Williams',
        title: 'HR Director, DataSystems Inc.',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        quote: 'Working with SSRM Tech has transformed our hiring process. Their consultative approach and industry expertise are unmatched.',
        name: 'David Chen',
        title: 'CEO, CloudNative Solutions',
        image: 'https://randomuser.me/api/portraits/men/67.jpg'
      }
    ]);
  }
  
  // Mock health check
  getHealth(): Observable<any> {
    return of({
      status: 'UP',
      message: 'Mock API is running',
      timestamp: Date.now()
    });
  }
}