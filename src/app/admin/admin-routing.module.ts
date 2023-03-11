import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminURL } from './admin.url';

const routes: Routes = [
  { path: '',
   redirectTo: 'administrator',
   pathMatch: 'full',
 },
 {
   path: AdminURL.Administrator,
   loadChildren: () =>
   import('./components/administrator/administrator.module').then(
     (mode) => mode.AdministratorModule
   )
 }
 ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
