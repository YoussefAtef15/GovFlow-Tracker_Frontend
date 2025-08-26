import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // تم تصحيح المسار هنا

// واجهة لتعريف هيكل بيانات الموظف
interface Employee {
  name: string;
  initial: string;
  department: string;
}

// واجهة لتعريف هيكل بيانات المهمة
interface EmployeeTask {
  id: string;
  serviceType: string;
  citizenName: string;
  submittedDate: string;
  dueDate: string;
  priority: 'high' | 'normal' | 'low';
  status: 'new' | 'in-progress' | 'completed';
}

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-tasks.html',
  styleUrls: ['./employee-tasks.css']
})
export class MyTasksComponent implements OnInit {

  // بيانات الموظف - سيتم تحديثها من بيانات المستخدم المسجل دخوله
  employee: Employee = {
    name: 'Loading...',
    initial: '',
    department: 'Loading...'
  };

  // بيانات وهمية للمهام
  allTasks: EmployeeTask[] = [];
  filteredTasks: EmployeeTask[] = [];

  // متغيرات الفلاتر
  searchTerm: string = '';
  statusFilter: string = 'all';
  priorityFilter: string = 'all';

  // متغيرات للتحكم في النافذة المنبثقة
  isModalVisible = false;
  selectedTask: EmployeeTask | null = null;

  constructor(private authService: AuthService) { } // حقن AuthService

  ngOnInit(): void {
    this.loadUserData();
    // تحميل البيانات الوهمية عند بدء تشغيل المكون
    this.allTasks = [
      { id: 'TSK-001', serviceType: 'Building Permit', citizenName: 'Ali Ahmed', submittedDate: '2024-08-20', dueDate: '2024-09-05', priority: 'high', status: 'new' },
      { id: 'TSK-002', serviceType: 'License Renewal', citizenName: 'Fatima Zahra', submittedDate: '2024-08-22', dueDate: '2024-08-30', priority: 'normal', status: 'in-progress' },
      { id: 'TSK-003', serviceType: 'Renovation Permit', citizenName: 'Youssef Khaled', submittedDate: '2024-08-15', dueDate: '2024-08-25', priority: 'normal', status: 'completed' },
      { id: 'TSK-004', serviceType: 'Cleanliness Complaint', citizenName: 'Sara Ibrahim', submittedDate: '2024-08-23', dueDate: '2024-08-26', priority: 'high', status: 'in-progress' },
      { id: 'TSK-005', serviceType: 'Vehicle Registration', citizenName: 'Omar Hassan', submittedDate: '2024-08-18', dueDate: '2024-09-02', priority: 'low', status: 'new' },
      { id: 'TSK-006', serviceType: 'Building Permit', citizenName: 'Layla Adel', submittedDate: '2024-08-24', dueDate: '2024-09-10', priority: 'normal', status: 'new' },
    ];
    this.applyFilters();
  }

  /**
   * تحميل بيانات المستخدم من AuthService.
   */
  loadUserData(): void {
    const currentUser = this.authService.currentUser(); // الحصول على المستخدم الحالي
    if (currentUser) {
      this.employee = {
        name: currentUser.fullName,
        department: currentUser.role.toLowerCase(), // استخدام الـ role كـ department
        initial: currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : ''
      };
    }
  }

  /**
   * تطبيق الفلاتر على قائمة المهام.
   */
  applyFilters(): void {
    let tasks = [...this.allTasks];

    // فلترة حسب الحالة
    if (this.statusFilter !== 'all') {
      tasks = tasks.filter(task => task.status === this.statusFilter);
    }

    // فلترة حسب الأولوية
    if (this.priorityFilter !== 'all') {
      tasks = tasks.filter(task => task.priority === this.priorityFilter);
    }

    // فلترة حسب نص البحث
    if (this.searchTerm) {
      const lowercasedTerm = this.searchTerm.toLowerCase();
      tasks = tasks.filter(task =>
        task.citizenName.toLowerCase().includes(lowercasedTerm) ||
        task.serviceType.toLowerCase().includes(lowercasedTerm)
      );
    }

    this.filteredTasks = tasks;
  }

  /**
   * عرض تفاصيل المهمة في نافذة منبثقة.
   * @param taskId - معرف المهمة.
   */
  viewTaskDetails(taskId: string): void {
    this.selectedTask = this.allTasks.find(task => task.id === taskId) || null;
    if (this.selectedTask) {
      this.isModalVisible = true;
    }
  }

  protected getInitials(name: string): string {
    if (!name) return '';

    const parts = name.trim().split(/\s+/);

    // لو أقل من كلمتين → رجع أول حرف بس
    if (parts.length < 2) {
      return parts[0][0].toUpperCase();
    }

    // أول حرف من أول اسم + أول حرف من تاني اسم
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }


  /**
   * إغلاق النافذة المنبثقة.
   */
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedTask = null;
  }

  /**
   * دالة وهمية لوضع علامة "مكتمل" على المهمة.
   * @param taskId - معرف المهمة.
   */
  markAsComplete(taskId: string): void {
    console.log('Marking task as complete:', taskId);
    const task = this.allTasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      this.applyFilters(); // إعادة تطبيق الفلاتر لتحديث الواجهة
    }
  }
}
