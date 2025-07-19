import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css'
})
export class ServicesComponent {
  // Core services data
  coreServices = [
    {
      icon: '💻',
      title: 'IT Staffing',
      description: 'Connect with top tech talent across all technology domains to power your digital innovation.',
      features: [
        'Specialized technical recruitment',
        'Skill assessment and validation',
        'Rapid placement of qualified candidates',
        'Industry-specific talent pools'
      ]
    },
    {
      icon: '🚀',
      title: 'Software Development',
      description: 'Custom software solutions designed to meet your specific business requirements and challenges.',
      features: [
        'Full-stack web & mobile development',
        'Enterprise application integration',
        'Legacy system modernization',
        'DevOps implementation & support'
      ]
    },
    {
      icon: '☁️',
      title: 'Cloud Services',
      description: 'Comprehensive cloud solutions for scalable, secure, and resilient infrastructure.',
      features: [
        'Cloud migration & strategy',
        'Infrastructure as Code (IaC)',
        'Multi-cloud management',
        'Cloud security & compliance'
      ]
    },
    {
      icon: '📊',
      title: 'IT Consulting',
      description: 'Strategic technology guidance to optimize your IT infrastructure and drive business growth.',
      features: [
        'IT strategy development',
        'Digital transformation roadmaps',
        'Technology stack optimization',
        'IT governance & compliance'
      ]
    }
  ];

  // Specialized services data
  specializedServices = [
    {
      icon: '🔒',
      title: 'Cybersecurity',
      description: 'Protect your business with comprehensive security solutions that safeguard your data and systems.',
      features: [
        'Security assessment & auditing',
        'Penetration testing',
        'Security monitoring & response',
        'Compliance management'
      ]
    },
    {
      icon: '🤖',
      title: 'AI & Machine Learning',
      description: 'Leverage the power of artificial intelligence to gain insights and automate complex processes.',
      features: [
        'Predictive analytics',
        'Natural language processing',
        'Computer vision solutions',
        'AI model development & training'
      ]
    },
    {
      icon: '📱',
      title: 'Mobile Development',
      description: 'Create engaging mobile experiences that connect with your customers wherever they are.',
      features: [
        'Native iOS & Android development',
        'Cross-platform solutions',
        'Mobile UX/UI design',
        'App performance optimization'
      ]
    },
    {
      icon: '📈',
      title: 'Data Analytics',
      description: 'Transform your data into actionable insights that drive strategic business decisions.',
      features: [
        'Business intelligence solutions',
        'Data warehouse implementation',
        'Big data processing',
        'Custom dashboard development'
      ]
    }
  ];

  // Industry solutions data
  industrySolutions = [
    {
      name: 'Healthcare',
      icon: '🏥',
      solutions: [
        'Electronic Health Records (EHR) integration',
        'Telehealth platforms',
        'Healthcare data analytics',
        'HIPAA-compliant cloud solutions'
      ]
    },
    {
      name: 'Finance',
      icon: '💰',
      solutions: [
        'Fintech application development',
        'Secure payment processing systems',
        'Regulatory compliance solutions',
        'Financial data analytics'
      ]
    },
    {
      name: 'Manufacturing',
      icon: '🏭',
      solutions: [
        'IoT-enabled production monitoring',
        'Supply chain optimization',
        'Predictive maintenance systems',
        'Manufacturing execution systems'
      ]
    },
    {
      name: 'Retail',
      icon: '🛒',
      solutions: [
        'E-commerce platforms',
        'Inventory management systems',
        'Customer analytics',
        'Omnichannel retail solutions'
      ]
    }
  ];

  // Process steps
  processSteps = [
    {
      number: '01',
      title: 'Discovery',
      description: 'We begin by understanding your business objectives, challenges, and technical requirements.'
    },
    {
      number: '02',
      title: 'Strategy',
      description: 'Our experts develop a tailored approach that aligns with your goals and maximizes ROI.'
    },
    {
      number: '03',
      title: 'Implementation',
      description: 'We execute the plan with precision, keeping you informed throughout the process.'
    },
    {
      number: '04',
      title: 'Optimization',
      description: 'We continuously refine and improve to ensure optimal performance and results.'
    }
  ];
}
