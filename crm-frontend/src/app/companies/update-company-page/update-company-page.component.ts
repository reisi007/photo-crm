import {Component, Input, OnInit} from '@angular/core';
import {CompanyClientService} from '../../shared/http-clients/company-client.service';
import {OnDestroyable} from '../../shared/OnDestroyable';
import {ErrorOrSuccess, findOneById} from '../../shared/http-clients/abstract-client';
import {ErrorResponse, UpdateCompany} from '../../shared/http-clients/types';
import {map, take} from 'rxjs';

@Component({
  selector: 'app-update-company-page',
  templateUrl: './update-company-page.component.html',
  styleUrls: ['./update-company-page.component.css'],
})
export class UpdateCompanyPageComponent extends OnDestroyable implements OnInit {

  company?: ErrorOrSuccess<UpdateCompany, ErrorResponse>;

  @Input()
  set id(companyId: string) {
    this.client.getAll()
        .pipe(
          take(1),
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
