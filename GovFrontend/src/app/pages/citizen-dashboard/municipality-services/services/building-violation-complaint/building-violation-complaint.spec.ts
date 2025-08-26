import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FileComplaintComponent } from './file-complaint.component';

describe('FileComplaintComponent', () => {
  let component: FileComplaintComponent;
  let fixture: ComponentFixture<FileComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileComplaintComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FileComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.fullName).toBe('Ahmed Al-Rashid');
    expect(component.nationalId).toBe('123456789');
    expect(component.complaintType).toBe('Noise Complaint');
    expect(component.complaintDetails).toBe('');
    expect(component.uploadedFiles).toEqual([]);
    expect(component.showUploadedFiles).toBeFalse();
  });

  it('should add files when selected', () => {
    const mockFile = new File([''], 'evidence.jpg', { type: 'image/jpeg' });
    const mockEvent = { target: { files: [mockFile] } };

    component.onFileSelected(mockEvent);

    expect(component.uploadedFiles).toContain('evidence.jpg');
    expect(component.showUploadedFiles).toBeTrue();
  });

  it('should remove files', () => {
    component.uploadedFiles = ['evidence1.jpg', 'evidence2.pdf'];
    component.showUploadedFiles = true;

    component.removeFile(0);

    expect(component.uploadedFiles).toEqual(['evidence2.pdf']);
    expect(component.showUploadedFiles).toBeTrue();

    component.removeFile(0);
    expect(component.uploadedFiles).toEqual([]);
    expect(component.showUploadedFiles).toBeFalse();
  });

  it('should submit form', () => {
    spyOn(console, 'log');
    const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') };

    component.complaintTitle = 'Noisy construction at night';
    component.complaintType = 'Noise Complaint';
    component.complaintDetails = 'Construction work continues past 10 PM in my neighborhood';
    component.submitServiceRequest(mockEvent as unknown as Event);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Complaint form submitted', {
      fullName: 'Ahmed Al-Rashid',
      nationalId: '123456789',
      complaintTitle: 'Noisy construction at night',
      complaintType: 'Noise Complaint',
      complaintDetails: 'Construction work continues past 10 PM in my neighborhood',
      uploadedFiles: []
    });
  });
});
