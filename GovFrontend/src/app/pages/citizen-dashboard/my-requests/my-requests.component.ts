import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// ✅ 1. تم تصحيح اسم الملف هنا إلى 'service-request.service
import { ServiceRequestService, ServiceRequestDto } from '../../../services/service-request.service';

interface UploadResponse {
  success: boolean;
  fileName: string;
}

@Component({
  selector: 'app-my-requests',
  standalone: true,
  // ✅ 2. تم حذف 'RouterLink' من هنا لأنه غير مستخدم في ملف الـ HTML
  imports: [CommonModule, FormsModule],
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  allRequests: ServiceRequestDto[] = [];
  filteredRequests: ServiceRequestDto[] = [];
  statusFilter: string = 'all';
  loading = true;
  error: string | null = null;

  constructor(private requestService: ServiceRequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.error = null;
    this.requestService.getMyRequests().subscribe({
      next: (data: ServiceRequestDto[]) => {
        this.allRequests = data;
        this.filteredRequests = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load requests.';
        this.loading = false;
      }
    });
  }

  filterRequests(): void {
    if (this.statusFilter === 'all') {
      this.filteredRequests = this.allRequests;
    } else {
      this.filteredRequests = this.allRequests.filter(
        (req: ServiceRequestDto) => req.status.toLowerCase().replace('_', '-') === this.statusFilter
      );
    }
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace('_', '-');
  }

  triggerFileUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event, request: ServiceRequestDto): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.requestService.uploadDocument(request.id, file).subscribe({
        next: (response: UploadResponse) => {
          if (response.success) {
            alert(`File "${response.fileName}" uploaded successfully!`);
          }
        },
        error: () => {
          alert('File upload failed. Please try again.');
        }
      });
    }
  }

  viewDocument(docName: string): void {
    alert(`Viewing document: ${docName} (This would open a document viewer).`);
  }

  downloadDocument(docName: string): void {
    alert(`Downloading document: ${docName} (This would start a file download).`);
  }
}
