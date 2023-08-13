import {AbstractRestClient} from './abstract-client';
import {HttpClient} from '@angular/common/http';
import {Order, UpdateOrder} from './types';

export class OrderClientService extends AbstractRestClient<UpdateOrder, Order> {

  constructor(httpClient: HttpClient, public readonly customerId: string) {
    super(httpClient, `customers/${customerId}/orders`);
  }
}
