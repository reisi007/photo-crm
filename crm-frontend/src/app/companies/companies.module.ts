import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './companies.component';
import { UpdateCompanyComponent } from './update-company-form/update-company.component';
import {ReactiveFormsModule} from '@angular/forms';
import { UpdateCompanyPageComponent } from './update-company-page/update-company-page.component';
import { CreateCompanyPageComponent } from './create-company-page/create-company-page.component';
import {AppModule} from '../app.module';


@NgModule({
  declarations: [
    CompaniesComponent,
    UpdateCompanyComponent,
    UpdateCompanyPageComponent,
    CreateCompanyPageComponent
  ],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    ReactiveFormsModule,
    AppModule,
  ],
})
export class CompaniesModule { }
