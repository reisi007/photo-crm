import {Component, OnInit} from '@angular/core';
import {ErrorOrSuccess} from '../../shared/http-clients/abstract-client';
import {Order, RestApiErrorResponse} from '../../shared/http-clients/types';
import {OnDestroyable} from '../../shared/OnDestroyable';
import {OrderClientService} from '../../shared/http-clients/order-client.service';
import {takeUntil} from 'rxjs';
import {OrderClientProvider} from './OrderClientProvider';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [OrderClientProvider],
})
export class OrdersComponent extends OnDestroyable implements OnInit {
  response?: ErrorOrSuccess<Array<Order>, RestApiErrorResponse>;


  constructor(
    private restClient: OrderClientService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.restClient.getAll()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({next: value => this.response = value});

    this.restClient.refresh();
  }
}
