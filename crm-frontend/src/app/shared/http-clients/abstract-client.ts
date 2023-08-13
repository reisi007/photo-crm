import {HttpClient} from '@angular/common/http';
import {HttpErrorResponseDetails, Id, RestApiErrorResponse, XOR} from './types';
import {Observable, Subject, takeUntil} from 'rxjs';
import {OnDestroyable} from '../OnDestroyable';

/**
 * Abstract class representing a REST client.
 *
 * @remarks
 * This class provides common functionality for interacting with a RESTful API.
 *
 * @typeParam UpdateData - The type of data used for updating resources.
 * @typeParam Data - The type of data returned by the REST API.
 */
export abstract class AbstractRestClient<UpdateData extends object, Data extends object> extends OnDestroyable {

  private subject: Subject<ErrorOrSuccess<Array<Data>, RestApiErrorResponse>> = new Subject();

  readonly restUrl!: string;


  constructor(protected httpClient: HttpClient, restUrl: string) {
    super();
    this.restUrl = '/rest/' + restUrl;
  }

  refresh() {
    this.httpClient.get<Array<Data>>(this.restUrl).subscribe(
      {
        next: success => this.subject.next({success}),
        error: error => this.subject.next({error}),
      },
    );
  }


  getAll(): Observable<ErrorOrSuccess<Array<Data>, RestApiErrorResponse>> {
    return this.subject.asObservable().pipe(
      takeUntil(this.onDestroy$),
    );
  }

  updateSome(updated: Array<UpdateData>) {
    return this.httpClient.post<RestApiErrorResponse | null>(this.restUrl, updated);
  }


  deleteSome(deleted: Array<UpdateData>) {
    return this.httpClient.request<RestApiErrorResponse | null>('delete', this.restUrl, {body: deleted});
  }

  updateOne(updated: UpdateData) {
    return this.updateSome([updated]);
  }

  deleteOne(deleted: UpdateData) {
    return this.deleteSome([deleted]);
  }
}

export type ErrorOrSuccess<S, E> = XOR<{ success: S }, { error: E }>


export function findOneById<ID extends string | number, T extends Id<ID>>(companies: ErrorOrSuccess<Array<T>, RestApiErrorResponse>, idToFind: ID): ErrorOrSuccess<T, HttpErrorResponseDetails> {
  if(companies.error !== undefined) {
    return companies;
  }
  const company = companies.success.find(cur => cur.id === idToFind);
  if(company !== undefined) {
    return {success: company};
  }
  else {
    return {error: {error: {statusCode: 404, statusDescription: 'Not found'}}};
  }
}
