import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersRoutingModule} from './customers-routing.module';
import {CustomersComponent} from './customers.component';
import {CreateCustomerPageComponent} from './create-customer-page/create-customer-page.component';
import {UpdateCustomerPageComponent} from './update-customer-page/update-customer-page.component';
import {UpdateCustomerFormComponent} from './update-customer-form/update-customer-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [
    CustomersComponent,
    CreateCustomerPageComponent,
    UpdateCustomerPageComponent,
    UpdateCustomerFormComponent,
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class CustomersModule {
}
