import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ManagerService, ReportStats, PerformanceMetric, TopPerformer, ReportData } from '../../services/manager.service';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.css']
})
export class ReportsDashboardComponent implements OnInit {
  stats: ReportStats | null = null;
  performanceMetrics: PerformanceMetric[] = [];
  topPerformers: TopPerformer[] = []; // ستبقى هذه فارغة حاليًا
  totalMetrics: any = null;

  selectedPeriod: string = 'Last 30 Days';
  periods = ['Last 30 Days', 'Last 90 Days', 'This Year'];

  math = Math;

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
    this.loadReportData();
  }

  loadReportData(): void {
    this.managerService.getReportData().subscribe((data: ReportData) => {
      this.stats = data.stats;
      this.performanceMetrics = data.performanceMetrics;
      // ✅ 1. تم إصلاح الخطأ هنا: إذا كانت topPerformers غير موجودة، نستخدم مصفوفة فارغة
      this.topPerformers = data.topPerformers ?? [];
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    if (this.performanceMetrics && this.performanceMetrics.length > 0) {
      const totalRequests = this.performanceMetrics.reduce((sum, item) => sum + item.totalRequests, 0);
      const approved = this.performanceMetrics.reduce((sum, item) => sum + item.approved, 0);
      const rejected = this.performanceMetrics.reduce((sum, item) => sum + item.rejected, 0);
      const totalSla = this.performanceMetrics.reduce((sum, item) => sum + (parseFloat(item.slaCompliance) || 0), 0);

      this.totalMetrics = {
        department: 'Total',
        totalRequests: totalRequests,
        approved: approved,
        rejected: rejected,
        approvalRate: ((approved / totalRequests) * 100).toFixed(1),
        avgTime: (this.performanceMetrics.reduce((sum, item) => sum + item.avgTime, 0) / this.performanceMetrics.length).toFixed(1),
        slaCompliance: (totalSla / this.performanceMetrics.length).toFixed(0)
      };
    }
  }

  // ✅ 2. تم إصلاح الخطأ هنا: الدالة الآن تقبل قيمة قد تكون undefined
  getStatChangeClass(change: number | undefined): string {
    if (change === undefined) return '';
    if (change > 0) return 'stat-change-positive';
    if (change < 0) return 'stat-change-negative';
    return '';
  }
}
