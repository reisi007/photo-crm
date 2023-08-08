import { Injectable } from '@angular/core';
import {AbstractRestClient} from './abstract-client';
import {HttpClient} from '@angular/common/http';
import {Customer, UpdateCustomer} from './types';

@Injectable({
  providedIn: 'root'
})
export class CustomerClientService extends AbstractRestClient<UpdateCustomer,Customer>{


  constructor(httpClient: HttpClient) {
    super("customers",httpClient);
  }
}
