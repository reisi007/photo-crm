import {AbstractRestClient} from './abstract-client';
import {HttpClient} from '@angular/common/http';
import {Order, UpdateOrder} from './types';
import {ActivatedRoute} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderClientService extends AbstractRestClient<UpdateOrder, Order> {

  constructor(httpClient: HttpClient, activatedRoute: ActivatedRoute) {
    super(httpClient);

    activatedRoute.paramMap.subscribe((params) => {
      const customerId = params.get('customerId');
      this.setRestUrl(`customers/${customerId}/orders`);
    });
  }
}
