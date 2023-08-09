import {HttpClient} from '@angular/common/http';
import {ErrorResponse, Id, XOR} from './types';
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

  private readonly subject = new Subject<ErrorOrSuccess<Array<Data>, ErrorResponse>>();

  protected readonly restUrl: string;

  protected constructor(restUrl: string, protected httpClient: HttpClient) {
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


  getAll(): Observable<ErrorOrSuccess<Array<Data>, ErrorResponse>> {
    return this.subject.asObservable().pipe(
      takeUntil(this.onDestroy$),
    );
  }

  updateSome(updated: Array<UpdateData>) {
    this.httpClient.put(this.restUrl, updated);
    this.refresh();
  }


  deleteSome(deleted: Array<UpdateData>) {
    this.httpClient.request('delete', this.restUrl, {body: deleted});
    this.refresh();
  }

  updateOne(updated: UpdateData) {
    this.updateSome([updated]);
  }

  deleteOne(deleted: UpdateData) {
    this.deleteSome([deleted]);
  }
}

export type ErrorOrSuccess<S, E> = XOR<{ success: S }, { error: E }>


export function findOneById<ID extends string | number, T extends Id<ID>>(companies: ErrorOrSuccess<Array<T>, ErrorResponse>, idToFind: ID): ErrorOrSuccess<T, ErrorResponse> {
  if(companies.error !== undefined) {
    return companies;
  }
  const company = companies.success.find(cur => cur.id === idToFind);
  if(company !== undefined) {
    return {success: company};
  }
  else {
    return {error: {statusCode: 404, statusDescription: 'Not found'}};
  }
}
