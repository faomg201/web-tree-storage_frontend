import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppURL } from './app.url';
import { NavbarComponent } from './shareds/components/navbar/navbar.component';
import { FooterComponent } from './shareds/components/footer/footer.component';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

import { HomeComponent } from './homepage/components/home/home.component';
import { AllproductComponent } from './homepage/components/allproduct/allproduct.component';
import { HowtobuyproductComponent } from './homepage/components/howtobuyproduct/howtobuyproduct.component';
import { ContactusComponent } from './homepage/components/contactus/contactus.component';

import { RePasswordComponent } from './re-password/re-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full',
  },
  { path: '', component: NavbarComponent, outlet: 'navbar' },
  { path: '', component: FooterComponent, outlet: 'footer' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'Re-Password', component: RePasswordComponent },

  { path: 'home', component: HomeComponent },
  { path: 'allproduct', component: AllproductComponent },
  { path: 'howtobuyproduct', component: HowtobuyproductComponent },
  { path: 'contactus', component: ContactusComponent },

  {
    path: AppURL.Shareds,
    loadChildren: () =>
      import('./shareds/shareds.module').then((mod) => mod.SharedsModule)
  },
  {
    path: AppURL.Homepage,
    loadChildren: () =>
      import('./homepage/homepage.module').then((mod) => mod.HomepageModule)
  },
  {
    path: AppURL.Admin,
    loadChildren: () =>
    import('./admin/admin.module').then(
      (mode) => mode.AdminModule)
  }
  ,
  {
    path: AppURL.Admin,
    loadChildren: () =>
    import('./admin/admin.module').then(
      (mode) => mode.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
