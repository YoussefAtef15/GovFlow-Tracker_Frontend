import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiceRequestService } from '../../../../../services/service-request.service';
import { AuthService } from '../../../../../services/auth.service';
import { User } from '../../../../../interfaces/user.interface';

interface UploadedFile {
  file: File;
  name: string;
}

@Component({
  selector: 'app-license-renewal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './license-renewal.html',
  styleUrls: ['./license-renewal.css']
})
export class LicenseRenewalComponent implements OnInit {
  serviceRequestForm: FormGroup;
  uploadedFiles: UploadedFile[] = [];
  isLoading = false;
  isDragOver = false;
  userInfo: User | null = null;

  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  serviceDetails = {
    title: 'License Renewal',
    description: 'Renew your existing driver\'s license with updated information',
    requiredDocuments: [
      'Current License',
      'National ID',
      'Photograph'
    ],
    processingTime: '5-7 business days'
  };

  licenseCategories = [
    'Private Vehicle',
    'Motorcycle',
    'Commercial Vehicle'
  ];

  constructor(
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private router: Router,
    private authService: AuthService
  ) {
    this.serviceRequestForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      nationalId: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: ['', Validators.required],
      licenseCategory: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.userInfo = currentUser;
      this.serviceRequestForm.patchValue({
        fullName: currentUser.fullName,
        nationalId: (currentUser as any).nationalId
      });
    }
  }

  // ✅ START: تم تعديل هذه الدالة بالكامل لإرسال FormData
  onSubmit(): void {
    if (this.serviceRequestForm.invalid) {
      this.serviceRequestForm.markAllAsTouched();
      this.showAlert('Missing Information', 'Please fill in all required fields.', 'error');
      return;
    }
    if (this.uploadedFiles.length === 0) {
      this.showAlert('Missing Documents', 'Please upload the required documents.', 'error');
      return;
    }

    this.isLoading = true;

    // 1. إنشاء كائن FormData
    const formData = new FormData();

    // 2. تحضير بيانات الطلب
    const formDetails = this.serviceRequestForm.getRawValue();
    const requestPayload = {
      serviceName: this.serviceDetails.title,
      department: 'Traffic Department',
      details: JSON.stringify(formDetails)
    };

    // 3. إضافة البيانات والملفات إلى FormData
    formData.append('request', JSON.stringify(requestPayload));
    this.uploadedFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file, uploadedFile.name);
    });

    // 4. إرسال FormData إلى السيرفر
    this.serviceRequestService.createRequest(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showAlert('Success', 'Your license renewal request has been submitted successfully!', 'success');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting request', error);
        this.showAlert('Submission Failed', 'There was an error submitting your request. Please try again.', 'error');
      }
    });
  }
  // ✅ END: تم تعديل هذه الدالة

  // ... (باقي الدوال في المكون تبقى كما هي)
  showAlert(title: string, message: string, type: 'success' | 'error' = 'success') { this.alertTitle = title; this.alertMessage = message; this.alertType = type; this.isAlertVisible = true; }
  hideAlert() { this.isAlertVisible = false; }
  onDragOver(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; }
  onFileDrop(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; const files = event.dataTransfer?.files; if (files) { this.handleFiles(files); } }
  onFileSelected(event: any): void { this.handleFiles(event.target.files); }
  private isValidFileType(file: File): boolean { const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; return allowedTypes.includes(file.type); }
  private handleFiles(files: FileList): void { for (let i = 0; i < files.length; i++) { const file = files[i]; if (this.isValidFileType(file)) { this.uploadedFiles.push({ name: file.name, file: file }); } else { this.showAlert('Invalid File Type', `File "${file.name}" is not a supported format. Please upload images or PDFs.`, 'error'); } } }
  removeFile(index: number): void { this.uploadedFiles.splice(index, 1); }
  cancel(): void { this.router.navigate(['/traffic-services']); }
}
