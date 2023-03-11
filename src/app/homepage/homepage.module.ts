import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageRoutingModule } from './homepage-routing.module';
import { HomeComponent } from './components/home/home.component';
import { AllproductComponent } from './components/allproduct/allproduct.component';
import { HowtobuyproductComponent } from './components/howtobuyproduct/howtobuyproduct.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { NavbarhomepageComponent } from './components/navbarhomepage/navbarhomepage.component';

import { NgxPaginationModule }from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';





@NgModule({
  declarations: [
    HomeComponent,
    AllproductComponent,
    HowtobuyproductComponent,
    ContactusComponent,
    NavbarhomepageComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    HomepageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    NgxPaginationModule
  ]
})
export class HomepageModule { }
