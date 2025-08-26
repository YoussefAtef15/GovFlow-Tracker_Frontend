import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// ✅ Interface to hold file details
interface UploadedFile {
  name: string;
  file: File;
}

@Component({
  selector: 'app-business-license',
  templateUrl: './building-permit-renewal.html',
  styleUrls: ['./building-permit-renewal.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class BusinessLicenseComponent {
  serviceTitle: string = 'Business License';
  fullName: string = 'Ahmed Al-Rashid';
  nationalId: string = '123456789';
  licenseNumber: string = '';
  licenseCategory: string = 'Private Vehicle';

  uploadedFiles: UploadedFile[] = [];
  showUploadedFiles: boolean = false;
  isDragging: boolean = false;
  permitNumber: any;
  permitType: any;

  // --- Start: Pop-up Logic ---
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  constructor() { }

  showAlert(title: string, message: string, type: 'success' | 'error' = 'success') {
    this.alertTitle = title;
    this.alertMessage = message;
    this.alertType = type;
    this.isAlertVisible = true;
  }

  hideAlert() {
    this.isAlertVisible = false;
  }
  // --- End: Pop-up Logic ---

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    return allowedTypes.includes(file.type);
  }

  private processFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (this.isValidFileType(file)) {
        this.uploadedFiles.push({ name: file.name, file: file });
      } else {
        // Replaced alert with new pop-up
        this.showAlert('Invalid File Type', `File "${file.name}" is not a supported format. Please upload images or PDFs.`, 'error');
      }
    }
    this.showUploadedFiles = this.uploadedFiles.length > 0;
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    if (this.uploadedFiles.length === 0) {
      this.showUploadedFiles = false;
    }
  }

  triggerFileInput(): void {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.click();
  }

  submitServiceRequest(event: Event): void {
    event.preventDefault();
    console.log('Submitting service request...', {
      fullName: this.fullName,
      nationalId: this.nationalId,
      licenseNumber: this.licenseNumber,
      licenseCategory: this.licenseCategory,
      uploadedFiles: this.uploadedFiles.map(f => f.name)
    });
    // Replaced alert with new pop-up
    this.showAlert('Success', 'Service request submitted successfully!', 'success');
  }

  goBack(): void {
    console.log('Go back to services page');
  }
}
