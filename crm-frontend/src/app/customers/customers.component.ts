import {Component, OnInit} from '@angular/core';
import {CustomerClientService} from '../shared/http-clients/customer-client.service';
import {ErrorOrSuccess} from '../shared/http-clients/abstract-client';
import {Customer, RestApiErrorResponse} from '../shared/http-clients/types';
import {OnDestroyable} from '../shared/OnDestroyable';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent extends OnDestroyable implements OnInit {
  response?: ErrorOrSuccess<Array<Customer>, RestApiErrorResponse>;

  constructor(
    private restClient: CustomerClientService,
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
