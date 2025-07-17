import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Hero slider images
  heroImages = [
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
  ];
  
  // About slider images
  aboutImages = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
  
  // Current slide indexes
  currentSlide = 0;
  currentAboutSlide = 0;
  currentTestimonial = 0;
  
  // Interval IDs for automatic sliding
  private heroInterval: any;
  private aboutInterval: any;
  private testimonialInterval: any;
  
  ngOnInit() {
    // Start automatic sliders
    this.startHeroSlider();
    this.startAboutSlider();
    this.startTestimonialSlider();
  }
  
  ngOnDestroy() {
    // Clear intervals when component is destroyed
    this.stopHeroSlider();
    this.stopAboutSlider();
    this.stopTestimonialSlider();
  }
  
  // Hero slider methods
  startHeroSlider() {
    this.heroInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroImages.length;
    }, 5000);
  }
  
  stopHeroSlider() {
    clearInterval(this.heroInterval);
  }
  
  setCurrentSlide(index: number) {
    this.currentSlide = index;
    this.stopHeroSlider();
    this.startHeroSlider();
  }
  
  // About slider methods
  startAboutSlider() {
    this.aboutInterval = setInterval(() => {
      this.currentAboutSlide = (this.currentAboutSlide + 1) % this.aboutImages.length;
    }, 6000);
  }
  
  stopAboutSlider() {
    clearInterval(this.aboutInterval);
  }
  
  setAboutSlide(index: number) {
    this.currentAboutSlide = index;
    this.stopAboutSlider();
    this.startAboutSlider();
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