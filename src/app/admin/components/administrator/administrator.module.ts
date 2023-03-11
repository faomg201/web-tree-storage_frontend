import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPaginationModule }from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AccountComponent } from './account/account.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TreetypeComponent } from './treetype/treetype.component';
import { TreedetailComponent } from './treedetail/treedetail.component';
import { OrderComponent } from './order/order.component';
import { AboutmeComponent } from './aboutme/aboutme.component';



@NgModule({
  declarations: [
    AccountComponent,
    SidebarComponent,
    TreetypeComponent,
    TreedetailComponent,
    TreedetailComponent,
    OrderComponent,
    AboutmeComponent,
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    ImageCropperModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    [HotToastModule.forRoot()]
    
  ]
})
export class AdministratorModule { }
