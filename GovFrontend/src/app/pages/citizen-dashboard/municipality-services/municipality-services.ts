import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MunicipalityService, MunicipalityServiceData } from '../../../services/municipality.service';

@Component({
  selector: 'app-municipality-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './municipality-services.html',
  styleUrls: ['./municipality-services.css']
})
export class MunicipalityServicesComponent implements OnInit {
  services: MunicipalityServiceData[] = [];
  filteredServices: MunicipalityServiceData[] = [];
  searchQuery = '';
  selectedCategory = 'all';
  loading = true;
  error: string | null = null;

  constructor(private municipalityService: MunicipalityService, private router: Router) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;
    this.municipalityService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.filteredServices = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load services. Please try again later.';
        this.loading = false;
      }
    });
  }

  filterServices(): void {
    let tempServices = this.services;

    if (this.selectedCategory !== 'all') {
      tempServices = tempServices.filter(service => service.category === this.selectedCategory);
    }

    if (this.searchQuery) {
      tempServices = tempServices.filter(service =>
        service.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredServices = tempServices;
  }

  /**
   * Navigates to the correct service page based on the service title.
   * @param service The service data object.
   */
  applyForService(service: MunicipalityServiceData): void {
    console.log('Applying for service:', service.title);

    // Navigate based on keywords in the service title
    const title = service.title.toLowerCase();

    if (title.includes('building permit')) {
      this.router.navigate(['/municipality-services/building-permit']);
    }

    if (title.includes('building permit renewal')) {
      this.router.navigate(['/municipality-services/building-permit-renewal']);
    }

    else if (title.includes('cleanliness complaint')) {
      this.router.navigate(['/municipality-services/cleanliness-complaint']);
    } else if (title.includes('renovation permit')) {
      this.router.navigate(['/municipality-services/renovation-permit']);
    } else if (title.includes('violation complaint')) {
      // Assuming 'Building Violation Complaint' should go to 'file-complaint'
      this.router.navigate(['/municipality-services/file-complaint']);
    }
      // Add a case for business license if it exists in your routes
      // else if (title.includes('business license')) {
      //   this.router.navigate(['/municipality-services/business-license']);
    // }
    else {
      console.warn('No specific route configured for:', service.title);
      // Fallback navigation if needed
      // this.router.navigate(['/municipality-services']);
    }
  }
}
