import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-alerts.component.html',
  styleUrls: ['./system-alerts.component.css']
})
export class SystemAlertsComponent implements OnInit {
  alerts = [
    { type: 'warning', icon: 'fa-exclamation-triangle', title: 'High rejection rate in Building Permits', description: '15% rejection rate in the last week' },
    { type: 'danger', icon: 'fa-clock', title: 'Processing delays detected', description: '12 requests overdue in Traffic Department' },
    { type: 'info', icon: 'fa-user-plus', title: 'New employee onboarding', description: '2 new employees need access setup' }
  ];
  constructor() { }
  ngOnInit(): void { }
}
