import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs';
import {Company, RestApiErrorResponse} from '../shared/http-clients/types';
import {CompanyClientService} from '../shared/http-clients/company-client.service';
import {OnDestroyable} from '../shared/OnDestroyable';
import {ErrorOrSuccess} from '../shared/http-clients/abstract-client';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class CompaniesComponent extends OnDestroyable implements OnInit {
  response?: ErrorOrSuccess<Array<Company>, RestApiErrorResponse>;


  constructor(private restClient: CompanyClientService) {
    super();
  }

  ngOnInit(): void {
    debugger;
    this.restClient.getAll()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({next: value => this.response = value});

    this.restClient.refresh();
  }
}

