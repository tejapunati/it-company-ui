import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ServicesComponent } from './pages/services/services';
import { CareersComponent } from './pages/careers/careers';
import { AboutusComponent } from './pages/aboutus/aboutus';
import { ContactusComponent } from './pages/contactus/contactus';
import { AdminRegisterComponent } from './pages/admin/admin-register';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { AdminDashboardComponent } from './layout/admin-dashboard/admin-dashboard';
import { UserDashboardComponent } from './layout/user-dashboard/user-dashboard';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'careers', component: CareersComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contactus', component: ContactusComponent },
  { path: 'admin-register', component: AdminRegisterComponent },
   { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },


];

export const appRouterProviders = [provideRouter(routes)];
