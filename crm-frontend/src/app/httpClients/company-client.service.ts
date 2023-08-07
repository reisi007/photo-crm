import {Injectable} from '@angular/core';
import {AbstractRestClient} from './AbstractRestClient';
import {HttpClient} from '@angular/common/http';
import {Company, UpdateCompany} from './types';

@Injectable({
  providedIn: 'root',
})
export class CompanyClientService extends AbstractRestClient<UpdateCompany, Company> {

  constructor(httpClient: HttpClient) {
    super('companies', httpClient);
  }
}
