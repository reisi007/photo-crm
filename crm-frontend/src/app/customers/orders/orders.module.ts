import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersComponent} from './orders.component';
import {CreateOrderPageComponent} from './create-order-page/create-order-page.component';
import {UpdateOrderPageComponent} from './update-order-page/update-order-page.component';
import {UpdateOrderFormComponent} from './update-order-form/update-order-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import { PrintOrderPageComponent } from './print-order-page/print-order-page.component';
import { PrintOrderComponent } from './print-order/print-order.component';
import { PrintAddressComponent } from './print-order/print-address/print-address.component';


@NgModule({
  declarations: [
    OrdersComponent,
    CreateOrderPageComponent,
    UpdateOrderPageComponent,
    UpdateOrderFormComponent,
    PrintOrderPageComponent,
    PrintOrderComponent,
    PrintAddressComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class OrdersModule {
}
