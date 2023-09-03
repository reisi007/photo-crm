import {Component, Input, OnInit} from '@angular/core';
import {OnDestroyable} from '../../../shared/OnDestroyable';
import {ErrorOrSuccess, findOneById} from '../../../shared/http-clients/abstract-client';
import {Customer, HttpErrorResponseDetails, Order} from '../../../shared/http-clients/types';
import {filter, map} from 'rxjs';
import {OrderClientService} from '../../../shared/http-clients/order-client.service';
import {CustomerClientService} from '../../../shared/http-clients/customer-client.service';
import {OrderClientProvider} from '../OrderClientProvider';

@Component({
  selector: 'app-print-order-page',
  templateUrl: './print-order-page.component.html',
  styleUrls: ['./print-order-page.component.css'],
  providers: [OrderClientProvider],
})
export class PrintOrderPageComponent extends OnDestroyable implements OnInit {
  order?: ErrorOrSuccess<Order, HttpErrorResponseDetails>;
  customer?: ErrorOrSuccess<Customer, HttpErrorResponseDetails>;

  @Input()
  set id(orderId: string) {
    const parsedOrderId = parseInt(orderId, 10);
    this.orderClient.getAll()
        .pipe(
          filter(e => e.success === undefined || e.success.length > 0),
          map(v => findOneById(v, parsedOrderId)),
        ).subscribe({next: (data) => this.order = data});
  }

  @Input()
  set customerId(customerId: string) {
    this.customerClient.getAll()
        .pipe(
          filter(e => e.success === undefined || e.success.length > 0),
          map(v => findOneById(v, customerId)),
        ).subscribe({next: data => this.customer = data});
  }

  constructor(
    private orderClient: OrderClientService,
    private customerClient: CustomerClientService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.customerClient.refresh();
    this.orderClient.refresh();
  }
}
