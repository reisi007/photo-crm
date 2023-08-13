import {Component, Input, OnInit} from '@angular/core';
import {OnDestroyable} from '../../shared/OnDestroyable';
import {ErrorOrSuccess, findOneById} from '../../shared/http-clients/abstract-client';
import {HttpErrorResponseDetails, UpdateCustomer} from '../../shared/http-clients/types';
import {map} from 'rxjs';
import {CustomerClientService} from '../../shared/http-clients/customer-client.service';

@Component({
  selector: 'app-update-customer-page',
  templateUrl: './update-customer-page.component.html',
  styleUrls: ['./update-customer-page.component.css'],
})
export class UpdateCustomerPageComponent extends OnDestroyable implements OnInit {
  customer?: ErrorOrSuccess<UpdateCustomer, HttpErrorResponseDetails>;

  @Input()
  set id(customerId: string) {
    this.client.getAll()
        .pipe(
          map(v => findOneById(v, customerId)),
        ).subscribe({next: (data) => this.customer = data});
  }

  constructor(
    private client: CustomerClientService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.client.refresh();
  }
}
