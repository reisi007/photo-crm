import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomersComponent} from './customers.component';
import {CreateCustomerPageComponent} from './create-customer-page/create-customer-page.component';
import {UpdateCustomerPageComponent} from './update-customer-page/update-customer-page.component';

const routes: Routes = [
  {path: '', component: CustomersComponent}, {
    path: 'create',
    component: CreateCustomerPageComponent,
  },
  {path: ':id', component: UpdateCustomerPageComponent},
  {
    path: ':customerId/orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {
}
