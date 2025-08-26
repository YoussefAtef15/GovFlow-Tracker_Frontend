import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router'; // Import Router for navigation

// This interface matches the data structure your component expects
export interface TrafficServiceData {
  id: string;
  title: string;
  description: string;
  category: 'license' | 'violations' | 'vehicles'; // Category is needed for the filter
  requiredDocuments: string[];
  processingTime: string;
  fee: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  // Add Router to the constructor
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router // Inject Router
  ) { }

  getServices(): Observable<TrafficServiceData[]> {
    // ✅ Instead of an HTTP call, we now define a mock data array here
    const mockServices: TrafficServiceData[] = [
      {
        id: "1",
        title: "Driver License Issuance", // Changed title to match the route
        description: "Apply for a new driver's license.",
        category: 'license',
        requiredDocuments: ["National ID", "Medical Certificate", "Photograph"],
        processingTime: "7-10 Business Days",
        fee: "$30.00",
        icon: "fa-id-card"
      },
      {
        id: "2",
        title: "License Renewal", // Changed title to match the route
        description: "Renew your existing driver's license.",
        category: 'license',
        requiredDocuments: ["Current License", "National ID", "Photograph"],
        processingTime: "5-7 Business Days",
        fee: "$25.00",
        icon: "fa-sync-alt"
      },
      {
        id: "3",
        title: "Pay Traffic Violation",
        description: "View and pay your outstanding traffic violations.",
        category: 'violations',
        requiredDocuments: ["Vehicle Plate Number"],
        processingTime: "Instant",
        fee: "Varies",
        icon: "fa-file-invoice-dollar"
      },
      {
        id: "4",
        title: "Vehicle Registration",
        description: "Register a new vehicle.",
        category: 'vehicles',
        requiredDocuments: ["Ownership Contract", "Technical Inspection"],
        processingTime: "7-10 Business Days",
        fee: "$50.00",
        icon: "fa-car"
      },
      {
        id: "5",
        title: "License Replacement",
        description: "Replace a lost or damaged driver's license.",
        category: 'license',
        requiredDocuments: ["Police Report", "National ID"],
        processingTime: "5-7 Business Days",
        fee: "$15.00",
        icon: "fa-exchange-alt"
      }
    ];

    // ✅ Return the mock data as an Observable using 'of()'
    return of(mockServices);
  }

  // This method will handle navigation based on service type
  navigateToService(service: TrafficServiceData): void {
    console.log("Navigating to service:", service.title);

    // Check the service title and navigate accordingly
    if (service.title === "Driver's License Issuance") {
      this.router.navigate(['/traffic-services/issue-license']);
    } else if (service.title === "License Renewal") {
      this.router.navigate(['/traffic-services/renew-license']);
    } else {
      // For other services, use the apply method
      this.applyForService(service).subscribe({
        next: (response) => {
          alert('Application submitted successfully! (Simulated)');
          console.log('Application Response:', response);
        },
        error: (err) => {
          alert('Failed to submit application. (Simulated)');
          console.error('Application Error:', err);
        }
      });
    }
  }

  // This method will not be called in the frontend-only version, but we leave it for the future
  applyForService(service: TrafficServiceData): Observable<any> {
    console.log("Applying for service", service);
    // In frontend-only mode, we can simulate a successful response
    return of({
      success: true,
      message: "Application submitted successfully (simulated).",
      requestId: `REQ-${Date.now()}`
    });
  }
}
