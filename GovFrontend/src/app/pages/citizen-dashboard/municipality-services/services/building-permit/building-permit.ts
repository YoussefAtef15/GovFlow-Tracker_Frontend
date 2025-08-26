import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ServiceRequestService } from '../../../../../services/service-request.service';
import { AuthService } from '../../../../../services/auth.service';
import { User } from '../../../../../interfaces/user.interface';

interface UploadedFile {
  name: string;
  file: File;
}

@Component({
  selector: 'app-building-permit',
  templateUrl: './building-permit.html',
  styleUrls: ['./building-permit.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class BuildingPermitComponent implements OnInit {
  permitForm: FormGroup;
  uploadedFiles: UploadedFile[] = [];
  isDragging = false;
  isLoading = false;

  // Pop-up logic
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService,
    private router: Router
  ) {
    this.permitForm = this.fb.group({
      fullName: [{ value: '', disabled: true }, Validators.required],
      nationalId: [{ value: '', disabled: true }, Validators.required],
      propertyId: ['', Validators.required],
      constructionType: ['New Construction', Validators.required]
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.permitForm.patchValue({
        fullName: currentUser.fullName,
        nationalId: (currentUser as any).nationalId
      });
    }
  }

  // ✅ START: تم تحديث هذه الدالة بالكامل لإرسال FormData
  onSubmit(): void {
    if (this.permitForm.invalid) {
      this.permitForm.markAllAsTouched();
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

    // 2. تحضير بيانات الطلب الأساسية
    const formDetails = this.permitForm.getRawValue();
    const requestPayload = {
      serviceName: 'Building Permit', // اسم الخدمة كما هو في قاعدة البيانات
      department: 'Local Municipality', // اسم القسم كما هو في قاعدة البيانات
      details: JSON.stringify(formDetails) // تحويل تفاصيل الفورم إلى JSON
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
        this.showAlert('Success', 'Your building permit request has been submitted successfully!', 'success');
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting request:', error);
        this.showAlert('Submission Failed', 'There was an error submitting your request. Please try again.', 'error');
      }
    });
  }
  // ✅ END: التعديل

  // ... (باقي الدوال المساعدة تبقى كما هي)
  showAlert(title: string, message: string, type: 'success' | 'error' = 'success') { this.alertTitle = title; this.alertMessage = message; this.alertType = type; this.isAlertVisible = true; }
  hideAlert() { this.isAlertVisible = false; }
  onDragOver(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragging = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragging = false; }
  onDrop(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragging = false; const files = event.dataTransfer?.files; if (files && files.length > 0) { this.processFiles(files); } }
  onFileSelected(event: any): void { const files = event.target.files; if (files && files.length > 0) { this.processFiles(files); } }
  private isValidFileType(file: File): boolean { const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; return allowedTypes.includes(file.type); }
  private processFiles(files: FileList): void { for (let i = 0; i < files.length; i++) { const file = files[i]; if (this.isValidFileType(file)) { this.uploadedFiles.push({ name: file.name, file: file }); } else { this.showAlert('Invalid File Type', `File "${file.name}" is not a supported format.`, 'error'); } } }
  removeFile(index: number): void { this.uploadedFiles.splice(index, 1); }
  triggerFileInput(): void { const fileUpload = document.getElementById('fileUpload') as HTMLInputElement; fileUpload.click(); }
  goBack(): void { this.router.navigate(['/municipality-services']); }
}
