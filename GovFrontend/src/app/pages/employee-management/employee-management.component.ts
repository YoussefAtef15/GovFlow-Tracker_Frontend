import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ManagerService, Employee } from '../../services/manager.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {

  allEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];

  showModal = false;
  isEditMode = false;
  currentEmployee: Employee | null = null;

  showDeleteConfirm = false;
  employeeToDelete: Employee | null = null;

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
    this.managerService.getEmployees().subscribe(data => {
      this.allEmployees = data;
      this.filteredEmployees = data;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentEmployee = { id: 0, name: '', email: '', avatar: '', department: '', position: '', hireDate: '', status: 'Active' };
    this.showModal = true;
  }

  openEditModal(employee: Employee): void {
    this.isEditMode = true;
    this.currentEmployee = { ...employee };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentEmployee = null;
  }

  saveEmployee(): void {
    if (this.currentEmployee) {
      if (this.isEditMode) {
        // Edit logic here
      } else {
        // Add logic here
      }
      this.closeModal();
    }
  }

  confirmDelete(employee: Employee): void {
    this.employeeToDelete = employee;
    this.showDeleteConfirm = true;
  }

  deleteEmployee(): void {
    if (this.employeeToDelete) {
      this.managerService.deleteEmployee(this.employeeToDelete.id).subscribe(success => {
        if (success) {
          this.allEmployees = this.allEmployees.filter(emp => emp.id !== this.employeeToDelete!.id);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== this.employeeToDelete!.id);
        }
        this.closeDeleteConfirm();
      });
    }
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'status-active';
      case 'On Leave': return 'status-on-leave';
      case 'Suspended': return 'status-suspended';
      default: return '';
    }
  }
}
