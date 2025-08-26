import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule

@Component({
  selector: 'app-employee-performance',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Add FormsModule
  templateUrl: './employee-performance.component.html',
  styleUrls: ['./employee-performance.component.css']
})
export class EmployeePerformanceComponent implements OnInit {

  allEmployees = [
    { name: 'Sarah Mitchell', department: 'Traffic', processed: 45, avgTime: '3.2 days', approvalRate: '92%', performance: 'Excellent' },
    { name: 'Ahmed Hassan', department: 'Municipality', processed: 38, avgTime: '4.8 days', approvalRate: '85%', performance: 'Good' },
    { name: 'Fatima Ali', department: 'Traffic', processed: 32, avgTime: '4.5 days', approvalRate: '78%', performance: 'Average' }
  ];

  filteredEmployees = [...this.allEmployees];

  // ✅ Filter properties and options
  selectedMonth: string = 'This Month';
  selectedDepartment: string = 'All Departments';

  months = ['This Month', 'Last Month', 'Last 3 Months'];
  departments = ['All Departments', 'Traffic', 'Municipality'];

  constructor() { }

  ngOnInit(): void { }

  filterData(): void {
    let tempEmployees = this.allEmployees;

    if (this.selectedDepartment !== 'All Departments') {
      tempEmployees = tempEmployees.filter(emp => emp.department === this.selectedDepartment);
    }

    // Add logic for month filtering if you have date data
    // For now, it just filters by department

    this.filteredEmployees = tempEmployees;
  }

  getPerformanceClass(performance: string): string {
    switch (performance.toLowerCase()) {
      case 'excellent': return 'performance-excellent';
      case 'good': return 'performance-good';
      case 'average': return 'performance-average';
      default: return 'performance-default';
    }
  }
}
