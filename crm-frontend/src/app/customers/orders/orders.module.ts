import {APP_INITIALIZER, FactoryProvider, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersComponent} from './orders.component';
import {CreateOrderPageComponent} from './create-order-page/create-order-page.component';
import {UpdateOrderPageComponent} from './update-order-page/update-order-page.component';
import {UpdateOrderFormComponent} from './update-order-form/update-order-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {OrderClientService} from '../../shared/http-clients/order-client.service';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [
    OrdersComponent,
    CreateOrderPageComponent,
    UpdateOrderPageComponent,
    UpdateOrderFormComponent,
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
