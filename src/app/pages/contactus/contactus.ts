import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contactus.html',
  styleUrls: ['./contactus.css']
})
export class ContactusComponent {
  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  openFaq: number | null = null;
  
  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }
  
  onSubmit() {
    // In a real application, this would send the form data to a backend service
    console.log('Form submitted:', this.contactForm);
    
    // Reset the form after submission
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    
    // Show success message (in a real app, you'd use a proper notification system)
    alert('Thank you for your message! We will get back to you soon.');
  }
}