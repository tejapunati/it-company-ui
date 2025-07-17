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
  backgroundSlides = [1, 2, 3, 4, 5]; // Number of slides
  currentSlide = 0;
  slideInterval: any;
  
  ngOnInit() {
    // Start automatic slideshow
    this.startSlideshow();
  }
  
  ngOnDestroy() {
    // Clear interval when component is destroyed
    this.stopSlideshow();
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
}