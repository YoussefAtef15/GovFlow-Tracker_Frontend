import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { HelpComponent } from './pages/help/help';
import { ProfileComponent } from './pages/profile/profile';
import { NotificationsComponent } from './pages/notifications/notifications';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

import { CitizenDashboardComponent } from './pages/citizen-dashboard/citizen-dashboard';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard';
import { MyTasksComponent } from './pages/employee-dashboard/employee-tasks/employee-tasks';

import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ReportsDashboardComponent } from './pages/reports-dashboard/reports-dashboard.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { TrafficServicesComponent } from './pages/citizen-dashboard/traffic-services/traffic-services';
import { MunicipalityServicesComponent } from './pages/citizen-dashboard/municipality-services/municipality-services';
import { authGuard } from './guards/auth.guard';

import { MyRequestsComponent } from './pages/citizen-dashboard/my-requests/my-requests.component';
import { PaymentsComponent } from './pages/citizen-dashboard/payments/payments.component';



import { DriversLicenseIssuanceComponent } from './pages/citizen-dashboard/traffic-services/services/drivers-license-issuance/drivers-license-issuance';
import { LicenseRenewalComponent } from './pages/citizen-dashboard/traffic-services/services/license-renewal/license-renewal';
import { LicenseReplacementComponent } from './pages/citizen-dashboard/traffic-services/services/license-replacement/license-replacement';
import { TrafficViolationsComponent } from './pages/citizen-dashboard/traffic-services/services/traffic-violations/traffic-violations';
import {VehicleRegistrationComponent} from './pages/citizen-dashboard/traffic-services/services/vehicle-registration/vehicle-registration';


import { BuildingPermitComponent } from './pages/citizen-dashboard/municipality-services/services/building-permit/building-permit';
import { BusinessLicenseComponent } from './pages/citizen-dashboard/municipality-services/services/building-permit-renewal/building-permit-renewal';
import { CleanlinessComplaintComponent } from './pages/citizen-dashboard/municipality-services/services/cleanliness-complaint/cleanliness-complaint';
import { FileComplaintComponent } from './pages/citizen-dashboard/municipality-services/services/building-violation-complaint/building-violation-complaint';
import { RenovationPermitComponent } from './pages/citizen-dashboard/municipality-services/services/renovation-permit/renovation-permit';


export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'help', component: HelpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Citizen routes
  { path: 'citizen-dashboard', component: CitizenDashboardComponent, canActivate: [authGuard] },
  { path: 'my-requests', component: MyRequestsComponent, canActivate: [authGuard]},
  { path: 'payments', component: PaymentsComponent  ,canActivate: [authGuard] },


  // Employee routes
  { path: 'employee-dashboard', component: EmployeeDashboardComponent , canActivate: [authGuard] },
  { path: 'employee-tasks', component: MyTasksComponent, canActivate: [authGuard] },

  // Manager routes
  { path: 'manager-dashboard', component: ManagerDashboardComponent,canActivate: [authGuard] },
  { path: 'employees', component: EmployeeManagementComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsDashboardComponent, canActivate: [authGuard] },

  // Shared authenticated routes
  { path: "profile", component: ProfileComponent, canActivate: [authGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },

  // Service categories
  { path: 'traffic-services', component: TrafficServicesComponent, canActivate: [authGuard] },
  { path: 'municipality-services', component: MunicipalityServicesComponent, canActivate: [authGuard] },

  // Specific Traffic services
  { path: 'traffic-services/issue-license', component: DriversLicenseIssuanceComponent, canActivate: [authGuard] },
  { path: 'traffic-services/renew-license', component: LicenseRenewalComponent, canActivate: [authGuard] },
  { path: 'traffic-services/replace-license', component: LicenseReplacementComponent, canActivate: [authGuard] },
  { path: 'traffic-services/traffic-violations', component: TrafficViolationsComponent, canActivate: [authGuard] },
  { path: 'traffic-services/vehicle-registration', component: VehicleRegistrationComponent, canActivate: [authGuard] },

  // Specific Municipality services
  { path: 'municipality-services/building-permit', component: BuildingPermitComponent, canActivate: [authGuard]},
  { path: 'municipality-services/building-permit-renewal', component: BusinessLicenseComponent, canActivate: [authGuard]},
  { path: 'municipality-services/cleanliness-complaint', component: CleanlinessComplaintComponent, canActivate: [authGuard]},
  { path: 'municipality-services/file-complaint', component: FileComplaintComponent, canActivate: [authGuard]},
  { path: 'municipality-services/renovation-permit', component: RenovationPermitComponent, canActivate: [authGuard]},

  // Wildcard route must be last
  { path: '**', redirectTo: '' }
];
