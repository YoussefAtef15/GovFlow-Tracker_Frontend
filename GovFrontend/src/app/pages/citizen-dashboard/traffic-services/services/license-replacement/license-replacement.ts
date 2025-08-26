import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// ✅ Interface to hold file details
interface UploadedFile {
  file: File;
  name: string;
}

@Component({
  selector: 'app-license-replacement',
  standalone: true,
  templateUrl: './license-replacement.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./license-replacement.css']
})
export class LicenseReplacementComponent implements OnInit {
  replacementForm: FormGroup;
  uploadedFiles: UploadedFile[] = [];
  isSubmitting = false;
  isDragOver = false;

  // --- Start: Pop-up Logic ---
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  // --- End: Pop-up Logic ---

  constructor(private fb: FormBuilder, private router: Router) {
    this.replacementForm = this.fb.group({
      fullName: [{value: 'Ahmed Al-Rashid', disabled: true}, [Validators.required]],
      nationalId: [{value: '123456789', disabled: true}, [Validators.required]],
      licenseNumber: ['', [Validators.required]],
      licenseCategory: ['Private Vehicle', [Validators.required]],
      reason: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  // --- Pop-up Functions ---
  showAlert(title: string, message: string, type: 'success' | 'error' = 'success') {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;
  }

  hideAlert() {
    this.isAlertVisible = false;
  }
  // --- End: Pop-up Functions ---

  // --- File Handling ---
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

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: any): void {
    this.handleFiles(event.target.files);
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return allowedTypes.includes(file.type);
  }

  private handleFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFileType(file)) {
        this.uploadedFiles.push({ name: file.name, file: file });
      } else {
        this.showAlert('Invalid File Type', `File "${file.name}" is not a supported format. Please upload images or PDFs.`, 'error');
      }
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  // --- Form Submission ---
  onSubmit(): void {
    if (this.replacementForm.invalid) {
      this.replacementForm.markAllAsTouched();
      this.showAlert('Missing Information', 'Please fill in all required fields.', 'error');
      return;
    }
    if (this.uploadedFiles.length === 0) {
      this.showAlert('Missing Documents', 'Please upload the required documents.', 'error');
      return;
    }

    this.isSubmitting = true;
    console.log('Form submitted:', this.replacementForm.getRawValue());
    console.log('Files uploaded:', this.uploadedFiles.map(f => f.name));

    setTimeout(() => {
      this.isSubmitting = false;
      this.showAlert('Success', 'License replacement request submitted successfully!', 'success');
      // this.router.navigate(['/my-requests']);
    }, 2000);
  }

  onCancel(): void {
    this.router.navigate(['/traffic-services']);
  }
}
