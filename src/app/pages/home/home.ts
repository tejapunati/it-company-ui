import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

declare var particlesJS: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  // Services data
  services = [
    {
      title: 'IT Staffing',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/><path fill="currentColor" d="M13 10h-2v3H8v2h3v3h2v-3h3v-2h-3z"/></svg>',
      description: 'Connect with top tech talent across all technology domains to power your digital innovation.'
    },
    {
      title: 'Software Development',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>',
      description: 'Custom software solutions designed to meet your specific business requirements and challenges.'
    },
    {
      title: 'Cloud Services',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',
      description: 'Comprehensive cloud solutions for scalable, secure, and resilient infrastructure.'
    },
    {
      title: 'IT Consulting',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path fill="currentColor" d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>',
      description: 'Strategic technology guidance to optimize your IT infrastructure and drive business growth.'
    }
  ];
  
  // Technologies data
  technologies = [
    {
      name: 'Web Development',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/></svg>',
      tags: ['React', 'Angular', 'Node.js', 'Vue', 'Next.js']
    },
    {
      name: 'Cloud Computing',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>',
      tags: ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker']
    },
    {
      name: 'Data Science',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
      tags: ['Python', 'TensorFlow', 'PyTorch', 'Big Data', 'ML']
    }
  ];
  
  // Industries data
  industries = [
    {
      name: 'Information Technology',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>'
    },
    {
      name: 'Finance & Banking',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/></svg>'
    },
    {
      name: 'Healthcare',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z"/></svg>'
    },
    {
      name: 'Manufacturing',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>'
    },
    {
      name: 'Retail & E-commerce',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>'
    },
    {
      name: 'Telecommunications',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'
    }
  ];
  
  // Stats data
  stats = [
    { value: '500+', label: 'Successful Projects', offset: '0' },
    { value: '95%', label: 'Client Satisfaction', offset: '14' },
    { value: '200+', label: 'Partner Companies', offset: '113' },
    { value: '10+', label: 'Years Experience', offset: '198' }
  ];
  
  // Testimonials data
  testimonials = [
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
  ];
  
  // Current testimonial index
  currentTestimonial = 0;
  
  // Interval IDs for automatic sliding
  private testimonialInterval: any;
  
  ngOnInit() {
    // Start testimonial slider
    this.startTestimonialSlider();
    
    // Load particles.js script dynamically
    this.loadScript('https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js')
      .then(() => {
        this.initParticles();
      })
      .catch(error => console.error('Error loading particles.js', error));
      
    // Load AOS (Animate on Scroll) script dynamically
    this.loadScript('https://unpkg.com/aos@next/dist/aos.js')
      .then(() => {
        (window as any).AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true
        });
      })
      .catch(error => console.error('Error loading AOS', error));
  }
  
  ngAfterViewInit() {
    // Initialize stat counters
    this.initStatCounters();
    
    // Add scroll event listener for stats animation
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }
  
  ngOnDestroy() {
    // Clear intervals when component is destroyed
    this.stopTestimonialSlider();
    
    // Remove scroll event listener
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
  
  // Load external scripts dynamically
  loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }
  
  // Initialize particles.js
  initParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#4f46e5'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#8b5cf6',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'grab'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      });
    }
  }
  
  // Handle scroll events for animations
  handleScroll() {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        this.animateStatCounters();
        // Remove event listener after animation starts
        window.removeEventListener('scroll', this.handleScroll.bind(this));
      }
    }
  }
  
  // Initialize stat counters
  initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      (stat as HTMLElement).textContent = '0';
    });
  }
  
  // Animate stat counters
  animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const target = (stat as HTMLElement).getAttribute('data-target') || '0';
      const numTarget = parseInt(target.replace(/\D/g, ''), 10);
      const duration = 2000; // 2 seconds
      const step = numTarget / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < numTarget) {
          (stat as HTMLElement).textContent = Math.floor(current) + (target.includes('+') ? '+' : target.includes('%') ? '%' : '');
          requestAnimationFrame(updateCounter);
        } else {
          (stat as HTMLElement).textContent = target;
        }
      };
      
      updateCounter();
    });
  }
  
  // Testimonial slider methods
  startTestimonialSlider() {
    this.testimonialInterval = setInterval(() => {
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 7000);
  }
  
  stopTestimonialSlider() {
    clearInterval(this.testimonialInterval);
  }
  
  setTestimonial(index: number) {
    this.currentTestimonial = index;
    this.stopTestimonialSlider();
    this.startTestimonialSlider();
  }
}