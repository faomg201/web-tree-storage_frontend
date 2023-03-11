import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from '../shareds/components/navbar/navbar.component';
import { HomepageURL } from './homepage.url';

const routes: Routes = [{
  path: '',
  redirectTo: '',
  pathMatch: 'full',
},
{path: '', component: NavbarComponent, outlet: 'navbar'},
{
  path: HomepageURL.Components,
  loadChildren: () =>
  import('./homepage.module').then(
    (mode) => mode.HomepageModule
  )
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
