import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router'; // أضف Router هنا
import { TrafficService, TrafficServiceData } from '../../../services/traffic.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-traffic-services',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './traffic-services.html',
  styleUrls: ['./traffic-services.css']
})
export class TrafficServicesComponent implements OnInit {
  services: TrafficServiceData[] = [];
  filteredServices: TrafficServiceData[] = [];
  searchQuery = '';
  selectedCategory = 'all';
  loading = true;
  error: string | null = null;

  // أضف Router في constructor بدلاً من تعريفه كخاصية
  constructor(
    private trafficService: TrafficService,
    private router: Router // أضف Router هنا
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.error = null;
    this.trafficService.getServices().subscribe({
      next: (data: TrafficServiceData[]) => {
        this.services = data;
        this.filteredServices = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load services.';
        this.loading = false;
      }
    });
  }

  filterServices(): void {
    let tempServices = this.services;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      tempServices = tempServices.filter(service => service.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      tempServices = tempServices.filter(service =>
        service.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredServices = tempServices;
  }

  applyForService(service: TrafficServiceData): void {
    // توجيه مباشر حسب نوع الخدمة بدون الانتظار للاشتراك
    if (service.title === 'Driver License Issuance') {
      this.router.navigate(['/traffic-services/issue-license']);
    } else if (service.title === 'License Renewal') {
      this.router.navigate(['/traffic-services/renew-license']);
    }
    else if (service.title === 'License Replacement') {
      this.router.navigate(['/traffic-services/replace-license']);
    }
    else if (service.title === 'Pay Traffic Violation') {
      this.router.navigate(['/traffic-services/traffic-violations']);
    }
    else if (service.title === 'Vehicle Registration') {
      this.router.navigate(['/traffic-services/vehicle-registration']);
    }
  }
}
