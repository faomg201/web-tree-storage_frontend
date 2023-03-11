import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';

import { TreetypeComponent } from './treetype/treetype.component';
import { TreedetailComponent } from './treedetail/treedetail.component';
import { OrderComponent } from './order/order.component';
import { AboutmeComponent } from './aboutme/aboutme.component';


const routes: Routes = [
  {path: '', redirectTo: 'account', pathMatch: 'full'},
  {path: 'account', component: AccountComponent},
  {path: 'aboutme', component: AboutmeComponent},
  {path: 'treedetail', component: TreedetailComponent},
  {path: 'treetype', component: TreetypeComponent},
  {path: 'order', component: OrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
