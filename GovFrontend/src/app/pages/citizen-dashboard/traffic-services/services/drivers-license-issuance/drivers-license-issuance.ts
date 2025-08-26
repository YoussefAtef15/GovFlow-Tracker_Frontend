import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Corrected service and interface imports
import { ServiceRequestService } from '../../../../../services/service-request.service';
import { AuthService } from '../../../../../services/auth.service';
import { User } from '../../../../../interfaces/user.interface';

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-drivers-license-issuance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './drivers-license-issuance.html',
  styleUrls: ['./drivers-license-issuance.css']
})
export class DriversLicenseIssuanceComponent implements OnInit {
  licenseForm: FormGroup;
  uploadedFiles: UploadedFile[] = [];
  isDragOver = false;
  isLoading = false;
  userData: User | null = null;

  // --- Start: Pop-up Logic ---
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  // --- End: Pop-up Logic ---

  serviceInfo = {
    title: 'Driver\'s License Issuance',
    description: 'Apply for a new driver\'s license.',
    requiredDocuments: [
      'Copy of National ID',
      'Valid Medical Certificate',
      'Recent Personal Photograph'
    ],
    processingTime: '7-10 business days'
  };

  licenseCategories = [
    'Private Vehicle',
    'Motorcycle',
    'Commercial Vehicle'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService
  ) {
    this.licenseForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      nationalId: [{ value: '', disabled: true }, Validators.required],
      licenseNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,14}$/)]],
      licenseCategory: ['Private Vehicle', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.userData = currentUser;
      const nationalId = (currentUser as any).nationalId; // Handle potential lack of property
      this.licenseForm.patchValue({
        fullName: currentUser.fullName,
        nationalId: nationalId
      });
    }
  }

  // --- Pop-up Functions ---
  showAlert(title: string, message: string, type: 'success' | 'error' = 'success'): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;
  }

  hideAlert(): void {
    this.isAlertVisible = false;
  }
  // --- End Pop-up Functions ---

  // --- File Handling Functions ---

  onFileSelected(event: any): void {
    this.handleFiles(event.target.files);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFileType(file)) {
        this.uploadedFiles.push({
          file: file,
          name: file.name,
          size: file.size,
          type: file.type
        });
      } else {
        this.showAlert('Invalid File Type', `File "${file.name}" is not a supported format. Please upload images or PDFs.`, 'error');
      }
    }
  }

  isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return allowedTypes.includes(file.type);
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  getFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // --- Form Submission and Navigation ---

  // ✅ START: تم تعديل هذه الدالة بالكامل
  submitRequest(): void {
    if (this.licenseForm.invalid) {
      this.markFormGroupTouched();
      this.showAlert('Invalid Form', 'Please fill in all required fields correctly.', 'error');
      return;
    }

    if (this.uploadedFiles.length === 0) {
      this.showAlert('Missing Documents', 'Please upload the required documents.', 'error');
      return;
    }

    this.isLoading = true;

    // 1. إنشاء كائن FormData
    const formData = new FormData();

    // 2. تحضير بيانات الطلب الأساسية
    const formDetails = this.licenseForm.getRawValue();
    const requestPayload = {
      serviceName: this.serviceInfo.title,
      department: 'Traffic Department',
      details: JSON.stringify(formDetails)
    };

    // 3. إضافة البيانات (كنص JSON) والملفات إلى FormData
    formData.append('request', JSON.stringify(requestPayload));
    this.uploadedFiles.forEach(uploadedFile => {
      formData.append('files', uploadedFile.file, uploadedFile.name);
    });

    // 4. إرسال FormData إلى السيرفر
    this.serviceRequestService.createRequest(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.showAlert('Success', 'Your license issuance request has been submitted successfully!', 'success');
        this.licenseForm.reset();
        this.uploadedFiles = [];
        // Optional: Redirect after a delay or after user closes the alert
        // setTimeout(() => this.router.navigate(['/my-requests']), 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error submitting request:', error);
        this.showAlert('Submission Failed', 'There was an error submitting your request. Please try again.', 'error');
      }
    });
  }
  // ✅ END: تم تعديل هذه الدالة

  markFormGroupTouched(): void {
    Object.values(this.licenseForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/traffic-services']); // Navigate back to services list
  }

  get licenseNumberControl() {
    return this.licenseForm.get('licenseNumber');
  }
}
