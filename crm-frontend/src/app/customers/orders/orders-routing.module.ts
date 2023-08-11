import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OrdersComponent} from './orders.component';
import {CreateOrderPageComponent} from './create-order-page/create-order-page.component';
import {UpdateOrderPageComponent} from './update-order-page/update-order-page.component';

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
  }, {
    path: 'create',
    component: CreateOrderPageComponent,
  },
  {path: ':id', component: UpdateOrderPageComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {
}
