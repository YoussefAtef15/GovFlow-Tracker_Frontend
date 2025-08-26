import { Component, OnInit } from '@angular/core'; // ✅ 1. أضف OnInit
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // ✅ 2. أضف Router

// ✅ 3. استيراد الخدمات المطلوبة
import { ServiceRequestService } from '../../../../../services/service-request.service';
import { AuthService } from '../../../../../services/auth.service';

interface UploadedFile {
  name: string;
  file: File;
}

@Component({
  selector: 'app-renovation-permit',
  templateUrl: './renovation-permit.html',
  styleUrls: ['./renovation-permit.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class RenovationPermitComponent implements OnInit { // ✅ 4. أضف implements OnInit
  serviceTitle: string = 'Renovation Permit';
  fullName: string = ''; // سيتم ملؤه تلقائيًا
  nationalId: string = ''; // سيتم ملؤه تلقائيًا
  propertyAddress: string = '';
  renovationType: string = 'Interior';
  estimatedCost: string = '';
  contractorName: string = '';
  contractorLicense: string = '';
  startDate: string = '';
  endDate: string = '';
  uploadedFiles: UploadedFile[] = [];
  showUploadedFiles: boolean = false;
  isDragging: boolean = false;
  isLoading: boolean = false; // ✅ 5. متغير لتتبع حالة الإرسال

  // --- Pop-up Logic (تبقى كما هي) ---
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  // ✅ 6. حقن الخدمات في الـ constructor
  constructor(
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService,
    private router: Router
  ) { }

  // ✅ 7. دالة ngOnInit لجلب بيانات المستخدم عند تحميل الصفحة
  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.fullName = currentUser.fullName;
      this.nationalId = (currentUser as any).nationalId;
    }
  }

  // ✅ 8. تحديث دالة إرسال الطلب بالكامل
  submitServiceRequest(event: Event): void {
    event.preventDefault();
    if (!this.propertyAddress || !this.startDate || !this.endDate) {
      this.showAlert('Missing Information', 'Please fill in all required fields.', 'error');
      return;
    }
    if (this.uploadedFiles.length === 0) {
      this.showAlert('Missing Documents', 'Please upload the required documents.', 'error');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    const formDetails = {
      propertyAddress: this.propertyAddress,
      renovationType: this.renovationType,
      estimatedCost: this.estimatedCost,
      contractorName: this.contractorName,
      contractorLicense: this.contractorLicense,
      startDate: this.startDate,
      endDate: this.endDate
    };

    const requestPayload = {
      serviceName: this.serviceTitle,
      department: 'Local Municipality',
      details: JSON.stringify(formDetails)
    };

    formData.append('request', JSON.stringify(requestPayload));
    this.uploadedFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file, uploadedFile.name);
    });

    this.serviceRequestService.createRequest(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showAlert('Success', 'Your renovation permit request has been submitted successfully!', 'success');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting request:', error);
        this.showAlert('Submission Failed', 'There was an error submitting your request. Please try again.', 'error');
      }
    });
  }

  // ... (باقي الدوال مثل goBack و onFileSelected تبقى كما هي)
  showAlert(title: string, message: string, type: 'success' | 'error' = 'success') { this.alertTitle = title; this.alertMessage = message; this.alertType = type; this.isAlertVisible = true; }
  hideAlert() { this.isAlertVisible = false; }
  onDragOver(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragging = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragging = false; }
  onDrop(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragging = false; const files = event.dataTransfer?.files; if (files && files.length > 0) { this.processFiles(files); } }
  onFileSelected(event: any): void { const files = event.target.files; if (files && files.length > 0) { this.processFiles(files); } }
  private isValidFileType(file: File): boolean { const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; return allowedTypes.includes(file.type); }
  private processFiles(files: FileList): void { for (let i = 0; i < files.length; i++) { const file = files[i]; if (this.isValidFileType(file)) { this.uploadedFiles.push({ name: file.name, file: file }); } else { this.showAlert('Invalid File Type', `File "${file.name}" is not a supported format.`, 'error'); } } this.showUploadedFiles = this.uploadedFiles.length > 0; }
  removeFile(index: number): void { this.uploadedFiles.splice(index, 1); if (this.uploadedFiles.length === 0) { this.showUploadedFiles = false; } }
  triggerFileInput(): void { const fileUpload = document.getElementById('fileUpload') as HTMLInputElement; fileUpload.click(); }
  goBack(): void { this.router.navigate(['/municipality-services']); }
}
