import {Component, Input, OnInit} from '@angular/core';
import {OnDestroyable} from '../../../shared/OnDestroyable';
import {ErrorOrSuccess, findOneById} from '../../../shared/http-clients/abstract-client';
import {HttpErrorResponseDetails, UpdateOrder} from '../../../shared/http-clients/types';
import {OrderClientService} from '../../../shared/http-clients/order-client.service';
import {map, take} from 'rxjs';

@Component({
  selector: 'app-update-order-page',
  templateUrl: './update-order-page.component.html',
  styleUrls: ['./update-order-page.component.css'],
})
export class UpdateOrderPageComponent extends OnDestroyable implements OnInit {
  order?: ErrorOrSuccess<UpdateOrder, HttpErrorResponseDetails>;

  @Input()
  set id(orderId: string) {
    this.client.getAll()
        .pipe(
          take(1),
          map(v => findOneById(v, orderId)),
        ).subscribe({next: (data) => this.order = data});
  }

  constructor(
    private client: OrderClientService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.client.refresh();
  }
}
