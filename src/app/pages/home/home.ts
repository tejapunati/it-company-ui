import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

declare var particlesJS: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private dataService: DataService) {}
  // Data properties
  services: any[] = [];
  technologies: any[] = [];
  industries: any[] = [];
  stats: any[] = [];
  testimonials: any[] = [];
  
  // Fallback data in case backend is not available
  private fallbackServices = [
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
  ];
  
  private fallbackTechnologies = [
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
  ];
  
  private fallbackIndustries = [
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
    },
    {
      name: 'Retail & E-commerce',
      icon: '<i class="fas fa-shopping-cart"></i>'
    },
    {
      name: 'Telecommunications',
      icon: '<i class="fas fa-broadcast-tower"></i>'
    }
  ];
  
  private fallbackStats = [
    { value: '500+', label: 'Successful Projects', offset: '0' },
    { value: '95%', label: 'Client Satisfaction', offset: '14' },
    { value: '200+', label: 'Partner Companies', offset: '113' },
    { value: '10+', label: 'Years Experience', offset: '198' }
  ];
  
  private fallbackTestimonials = [
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
    // Load data from backend
    this.loadData();
    
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
    
    // Add resize event listener to handle responsive behavior
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Trigger initial check in case stats are already visible
    setTimeout(() => {
      this.handleScroll();
      this.handleResize();
    }, 500);
  }
  
  // Handle window resize events
  handleResize() {
    // Reinitialize particles on resize for better responsiveness
    if (typeof particlesJS !== 'undefined') {
      this.initParticles();
    }
  }
  
  ngOnDestroy() {
    // Clear intervals when component is destroyed
    this.stopTestimonialSlider();
    
    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    window.removeEventListener('resize', this.handleResize.bind(this));
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
            value: '#ffffff'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#ffffff'
            },
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: 'window',
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
        retina_detect: true,
        responsive: [
          {
            breakpoint: 768,
            options: {
              particles: {
                number: { value: 50 },
                line_linked: { distance: 100 }
              }
            }
          },
          {
            breakpoint: 480,
            options: {
              particles: {
                number: { value: 30 },
                line_linked: { distance: 80 }
              }
            }
          }
        ]
      });
    }
  }
  
  // Flag to track if stats have been animated
  private statsAnimated = false;
  
  // Handle scroll events for animations
  handleScroll() {
    // Skip if already animated
    if (this.statsAnimated) return;
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      
      if (isVisible) {
        console.log('Stats section is visible, starting animation');
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
      (stat as HTMLElement).dataset['animated'] = 'false';
    });
  }
  
  // Animate stat counters
  animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      // Skip if this counter has already been animated
      if ((stat as HTMLElement).dataset['animated'] === 'true') return;
      
      const target = (stat as HTMLElement).getAttribute('data-target') || '0';
      const numTarget = parseInt(target.replace(/\D/g, ''), 10);
      const duration = 2000; // 2 seconds
      const step = numTarget / (duration / 16); // 60fps
      let current = 0;
      
      // Mark as being animated
      (stat as HTMLElement).dataset['animated'] = 'true';
      
      const updateCounter = () => {
        current += step;
        if (current < numTarget) {
          (stat as HTMLElement).textContent = Math.floor(current) + (target.includes('+') ? '+' : target.includes('%') ? '%' : '');
          requestAnimationFrame(updateCounter);
        } else {
          (stat as HTMLElement).textContent = target;
        }
      };
      
      // Start the animation
      updateCounter();
    });
    
    // Force animation to start immediately
    this.statsAnimated = true;
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
  
  // Load data from backend
  loadData() {
    // Load services
    this.dataService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        console.log('Services loaded from backend:', data);
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.services = this.fallbackServices;
      }
    });
    
    // Load technologies
    this.dataService.getTechnologies().subscribe({
      next: (data) => {
        this.technologies = data;
        console.log('Technologies loaded from backend:', data);
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
        this.technologies = this.fallbackTechnologies;
      }
    });
    
    // Load industries
    this.dataService.getIndustries().subscribe({
      next: (data) => {
        this.industries = data;
        console.log('Industries loaded from backend:', data);
      },
      error: (error) => {
        console.error('Error loading industries:', error);
        this.industries = this.fallbackIndustries;
      }
    });
    
    // Load stats
    this.dataService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        console.log('Stats loaded from backend:', data);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.stats = this.fallbackStats;
      }
    });
    
    // Load testimonials
    this.dataService.getTestimonials().subscribe({
      next: (data) => {
        this.testimonials = data;
        console.log('Testimonials loaded from backend:', data);
      },
      error: (error) => {
        console.error('Error loading testimonials:', error);
        this.testimonials = this.fallbackTestimonials;
      }
    });
  }
}