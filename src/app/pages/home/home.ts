import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  backgroundSlides = [1, 2, 3, 4, 5]; // Number of slides
  currentSlide = 0;
  slideInterval: any;
  currentTestimonial = 0;
  testimonialInterval: any;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit() {
    // Start automatic slideshow
    this.startSlideshow();
    this.startTestimonialSlider();
    
    // Initialize counter animation when elements are in view
    this.initCounterAnimation();
  }
  
  ngAfterViewInit() {
    // Initialize tilt effect for service cards
    this.initTiltEffect();
    
    // Initialize parallax effect
    this.initParallaxEffect();
    
    // Initialize particles background
    this.initParticlesBackground();
  }
  
  ngOnDestroy() {
    // Clear intervals when component is destroyed
    this.stopSlideshow();
    this.stopTestimonialSlider();
  }
  
  startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Change slide every 5 seconds
  }
  
  stopSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.backgroundSlides.length;
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.backgroundSlides.length) % this.backgroundSlides.length;
  }
  
  setCurrentSlide(index: number) {
    this.currentSlide = index;
    // Reset the interval when manually changing slides
    this.stopSlideshow();
    this.startSlideshow();
  }
  
  // Testimonial slider methods
  startTestimonialSlider() {
    this.testimonialInterval = setInterval(() => {
      this.nextTestimonial();
    }, 6000); // Change testimonial every 6 seconds
  }
  
  stopTestimonialSlider() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }
  
  nextTestimonial() {
    const testimonials = this.elementRef.nativeElement.querySelectorAll('.testimonial');
    this.currentTestimonial = (this.currentTestimonial + 1) % testimonials.length;
    this.updateTestimonials();
  }
  
  prevTestimonial() {
    const testimonials = this.elementRef.nativeElement.querySelectorAll('.testimonial');
    this.currentTestimonial = (this.currentTestimonial - 1 + testimonials.length) % testimonials.length;
    this.updateTestimonials();
  }
  
  setTestimonial(index: number) {
    this.currentTestimonial = index;
    this.updateTestimonials();
    // Reset the interval when manually changing testimonials
    this.stopTestimonialSlider();
    this.startTestimonialSlider();
  }
  
  updateTestimonials() {
    const testimonials = this.elementRef.nativeElement.querySelectorAll('.testimonial');
    const dots = this.elementRef.nativeElement.querySelectorAll('.dot');
    
    testimonials.forEach((testimonial: HTMLElement, index: number) => {
      if (index === this.currentTestimonial) {
        testimonial.classList.add('active');
      } else {
        testimonial.classList.remove('active');
      }
    });
    
    dots.forEach((dot: HTMLElement, index: number) => {
      if (index === this.currentTestimonial) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Counter animation
  initCounterAnimation() {
    const counters = this.elementRef.nativeElement.querySelectorAll('.counter');
    
    const startCounting = (counter: HTMLElement) => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toString();
        }
      };
      
      updateCounter();
    };
    
    // Use Intersection Observer to start counting when element is in view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounting(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach((counter: HTMLElement) => {
        observer.observe(counter);
      });
    } else {
      // Fallback for browsers that don't support Intersection Observer
      counters.forEach((counter: HTMLElement) => {
        startCounting(counter);
      });
    }
  }
  
  // Tilt effect for service cards
  initTiltEffect() {
    const cards = this.elementRef.nativeElement.querySelectorAll('.tilt-card');
    
    cards.forEach((card: HTMLElement) => {
      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }
  
  // Parallax effect
  initParallaxEffect() {
    const parallaxContainers = this.elementRef.nativeElement.querySelectorAll('.parallax-container');
    
    parallaxContainers.forEach((container: HTMLElement) => {
      const img = container.querySelector('.parallax-img') as HTMLElement;
      
      container.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const moveX = (x - rect.width / 2) / 20;
        const moveY = (y - rect.height / 2) / 20;
        
        img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      });
      
      container.addEventListener('mouseleave', () => {
        img.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }
  
  // Particles background
  initParticlesBackground() {
    // This would typically use a library like particles.js
    // For simplicity, we'll just add a basic animation effect
    const particlesContainer = this.elementRef.nativeElement.querySelector('#particles-js');
    if (particlesContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 5 + 1;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Set styles
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        
        particlesContainer.appendChild(particle);
      }
    }
  }
}