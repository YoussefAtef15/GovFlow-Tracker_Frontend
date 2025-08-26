import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Violation {
  id: string; date: string; type: string; location: string;
  amount: number; status: string; description: string;
}

// ✅ Interface to hold file details
interface UploadedFile {
  file: File;
  name: string;
}

@Component({
  selector: 'app-traffic-violations',
  standalone: true,
  templateUrl: './traffic-violations.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  styleUrls: ['./traffic-violations.css']
})
export class TrafficViolationsComponent implements OnInit {
  violationForm: FormGroup;
  uploadedFiles: UploadedFile[] = [];
  isSubmitting = false;
  isDragOver = false;
  userInfo: any = { fullName: 'Ahmed Al-Rashid', nationalId: '123456789' };
  violations: Violation[] = [];
  selectedViolation: Violation | null = null;
  showViolationsList = false;

  // --- Start: Pop-up Logic ---
  isAlertVisible = false;
  alertTitle = '';
  alertMessage = '';
  alertType: 'success' | 'error' = 'success';
  // --- End: Pop-up Logic ---

  constructor(private fb: FormBuilder, private router: Router) {
    this.violationForm = this.fb.group({
      licenseNumber: ['', Validators.required],
      vehiclePlate: ['', Validators.required]
    });
  }

  ngOnInit() { this.loadViolations(); }

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

  loadViolations() { /* ... Mock data loading ... */ }
  getStatusClass(status: string): string { /* ... returns class based on status ... */ return ''; }
  viewDetails(violation: Violation) { this.selectedViolation = violation; }
  payViolation(violation: Violation) { /* ... mock payment ... */ }
  downloadReport(violation: Violation) { /* ... mock download ... */ }
  showLoading(message: string) { /* ... shows loading overlay ... */ }
  hideLoading() { /* ... hides loading overlay ... */ }

  // --- File Handling ---
  onDragOver(event: DragEvent): void {
    event.preventDefault(); event.stopPropagation(); this.isDragOver = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault(); event.stopPropagation(); this.isDragOver = false;
  }
  onFileDrop(event: DragEvent): void {
    event.preventDefault(); event.stopPropagation(); this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) { this.handleFiles(files); }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) { this.handleFiles(input.files); }
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

  // --- Form Submission & Navigation ---
  onSubmit(): void {
    if (this.violationForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false; this.showViolationsList = true;
      }, 1500);
    } else {
      this.violationForm.markAllAsTouched();
    }
  }
  onCancel(): void { this.router.navigate(['/traffic-services']); }
  goBack(): void { this.showViolationsList ? this.showViolationsList = false : this.router.navigate(['/traffic-services']); }
  searchAgain(): void { this.showViolationsList = false; this.violationForm.reset(); }
}
