import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ServicesComponent } from './pages/services/services';
import { CareersComponent } from './pages/careers/careers';
import { AboutusComponent } from './pages/aboutus/aboutus';
import { ContactusComponent } from './pages/contactus/contactus';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './auth/register/register';
import { AdminRegisterComponent } from './pages/admin-register/admin-register';
import { UserDashboardComponent } from './layout/user-dashboard/user-dashboard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { AdminApprovalComponent } from './pages/admin-approval/admin-approval';
import { ManageUsersComponent } from './pages/admin-dashboard/manage-users/manage-users';
import { TimesheetsComponent } from './pages/admin-dashboard/timesheets/timesheets';
import { AddUserComponent } from './pages/admin-dashboard/add-user/add-user';
import { UserApprovalsComponent } from './pages/user-approvals/user-approvals';
import { UserManagementComponent } from './pages/admin-dashboard/user-management/user-management';
import { AdminManagementComponent } from './pages/admin-dashboard/admin-management/admin-management';
import { EmailLogsComponent } from './pages/email-logs/email-logs';
import { ConnectionTestComponent } from './components/connection-test';
import { BackendStatusComponent } from './components/backend-status/backend-status.component';
import { ConnectionTestPageComponent } from './pages/connection-test-page/connection-test-page.component';
import { EmailDebugComponent } from './components/email-debug/email-debug.component';
import { SubmittedTimesheetsComponent } from './pages/submitted-timesheets/submitted-timesheets.component';
import { AuthGuard, AdminGuard, ParentAdminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'submitted-timesheets', component: SubmittedTimesheetsComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'admin-approval', component: AdminApprovalComponent, canActivate: [ParentAdminGuard] },
  { path: 'admin-dashboard/users', component: ManageUsersComponent, canActivate: [AdminGuard] }, 
  { path: 'admin-dashboard/add-user', component: AddUserComponent, canActivate: [AdminGuard] },
  { path: 'admin-dashboard/user-management', component: UserManagementComponent, canActivate: [ParentAdminGuard] },
  { path: 'admin-dashboard/admin-management', component: AdminManagementComponent, canActivate: [ParentAdminGuard] },
  { path: 'user-approvals', component: UserApprovalsComponent, canActivate: [AdminGuard] }, // Both admin and parent-admin can approve users
  { path: 'email-logs', component: EmailLogsComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard/timesheets', component: TimesheetsComponent, canActivate: [AdminGuard] },
  { path: 'test-connection', component: ConnectionTestComponent },
  { path: 'backend-status', component: BackendStatusComponent },
  { path: 'connection-test', component: ConnectionTestPageComponent },
  { path: 'email-debug', component: EmailDebugComponent },
  { path: '**', redirectTo: '' }
];

export const appRouterProviders = [provideRouter(routes)];
