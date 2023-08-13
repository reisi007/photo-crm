import {Component, Input, OnInit} from '@angular/core';
import {CompanyClientService} from '../../shared/http-clients/company-client.service';
import {OnDestroyable} from '../../shared/OnDestroyable';
import {ErrorOrSuccess, findOneById} from '../../shared/http-clients/abstract-client';
import {HttpErrorResponseDetails, UpdateCompany} from '../../shared/http-clients/types';
import {map} from 'rxjs';

@Component({
  selector: 'app-update-company-page',
  templateUrl: './update-company-page.component.html',
  styleUrls: ['./update-company-page.component.css'],
})
export class UpdateCompanyPageComponent extends OnDestroyable implements OnInit {

  company?: ErrorOrSuccess<UpdateCompany, HttpErrorResponseDetails>;

  @Input()
  set id(companyId: string) {
    this.client.getAll()
        .pipe(
          map(v => findOneById(v, companyId)),
        ).subscribe({next: (data) => this.company = data});
  }

  constructor(
    private client: CompanyClientService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.client.refresh();
  }

}
