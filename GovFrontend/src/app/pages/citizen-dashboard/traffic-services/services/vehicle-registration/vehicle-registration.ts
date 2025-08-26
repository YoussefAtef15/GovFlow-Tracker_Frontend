import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// ✅ Interface to hold file details
interface UploadedFile {
  file: File;
  name: string;
}

@Component({
  selector: 'app-vehicle-registration',
  templateUrl: './vehicle-registration.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  styleUrls: ['./vehicle-registration.css']
})
export class VehicleRegistrationComponent {
  fullName: string = 'Ahmed Al-Rashid';
  nationalId: string = '123456789';
  licenseNumber: string = '';
  licenseCategory: string = 'Private Vehicle';

  uploadedFiles: UploadedFile[] = [];
  showUploadedFiles: boolean = false;
  isDragging: boolean = false;

  categories = [
    'Private Vehicle',
    'Motorcycle',
    'Commercial Vehicle'
  ];

  // --- Start: Pop-up Logic ---
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

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

  // --- File Handling ---
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

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
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
    this.showUploadedFiles = this.uploadedFiles.length > 0;
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.showUploadedFiles = this.uploadedFiles.length > 0;
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileUpload') as HTMLElement;
    fileInput.click();
  }

  // --- Form Submission & Navigation ---
  submitServiceRequest(event: Event): void {
    event.preventDefault();
    if (this.uploadedFiles.length === 0) {
      this.showAlert('Missing Documents', 'Please upload the required documents.', 'error');
      return;
    }

    console.log('Form submitted', {
      fullName: this.fullName,
      nationalId: this.nationalId,
      licenseNumber: this.licenseNumber,
      licenseCategory: this.licenseCategory,
      uploadedFiles: this.uploadedFiles.map(f => f.name)
    });
    this.showAlert('Success', 'Vehicle registration request submitted successfully!', 'success');
  }

  goBack(): void {
    console.log('Navigating back to service browsing');
  }
}
