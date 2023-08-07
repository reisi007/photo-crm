import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable, Subject} from 'rxjs';

/**
 * Abstract class representing a REST client.
 *
 * @remarks
 * This class provides common functionality for interacting with a RESTful API.
 *
 * @typeParam UpdateData - The type of data used for updating resources.
 * @typeParam Data - The type of data returned by the REST API.
 */
export abstract class AbstractRestClient<UpdateData extends object, Data extends object> {

  private readonly subject = new Subject<Array<Data>>();

  protected readonly restUrl: string;

  protected constructor(restUrl: string, protected httpClient: HttpClient) {
    this.restUrl = '/rest/' + restUrl;
  }

  async refresh() {
    const value = await firstValueFrom(this.httpClient.get<Array<Data>>(this.restUrl));
    this.subject.next(value);
  }


  getAll(): Observable<Array<Data>> {
    return this.subject.asObservable();
  }

  async updateSome(updated: Array<UpdateData>) {
    await firstValueFrom(this.httpClient.put(this.restUrl, updated));
    await this.refresh();
  }


  async deleteSome(deleted: Array<UpdateData>) {
    await firstValueFrom(this.httpClient.request('delete', this.restUrl, {body: deleted}));
    await this.refresh();
  }

  async updateOne(updated: UpdateData) {
    await this.updateSome([updated]);
  }

  async deleteOne(deleted: UpdateData) {
    await this.deleteSome([deleted]);
  }
}
