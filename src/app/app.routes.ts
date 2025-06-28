import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ServicesComponent } from './pages/services/services';
import { CareersComponent } from './pages/careers/careers';
import { AboutusComponent } from './pages/aboutus/aboutus';
import { ContactusComponent } from './pages/contactus/contactus';
import { LoginComponent } from './auth/login/login';
import { AdminRegisterComponent } from './pages/admin-register/admin-register';
import { UserDashboardComponent } from './layout/user-dashboard/user-dashboard';
import { AdminApprovalComponent } from './pages/admin-approval/admin-approval';
import { ManageUsersComponent } from './pages/admin-dashboard/manage-users/manage-users';
import { TimesheetsComponent } from './pages/admin-dashboard/timesheets/timesheets';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'admin-register', component: AdminRegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'admin-approval', component: AdminApprovalComponent },
  { path: 'admin-dashboard/users', component: ManageUsersComponent }, 
  { path: 'admin-dashboard/timesheets', component: TimesheetsComponent },


];

export const appRouterProviders = [provideRouter(routes)];
