import {Injectable} from '@angular/core';
import {AbstractRestClient} from './abstract-client';
import {HttpClient} from '@angular/common/http';
import {Order, UpdateOrder} from './types';

@Injectable({
  providedIn: 'root',
})
export class OrderClientService extends AbstractRestClient<UpdateOrder, Order> {

  constructor(httpClient: HttpClient) {
    super('orders', httpClient);
  }
}
