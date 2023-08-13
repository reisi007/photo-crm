import {OrderClientService} from '../../shared/http-clients/order-client.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

let CACHED_VALUE: OrderClientService | undefined = undefined;

/**
 * OrderClientProvider is a factory provider for creating instances of OrderClientService.
 *
 * @type {Object}
 * @property {Function} provide - The token identifying the service being provided.
 * @property {Array} deps - The list of dependencies required by the factory function.
 * @property {Function} useFactory - The factory function for creating instances of OrderClientService.
 * @param {HttpClient} httpClient - The instance of HttpClient dependency.
 * @param {ActivatedRoute} route - The instance of ActivatedRoute dependency.
 * @returns {OrderClientService} - The instance of OrderClientService.
 */
export const OrderClientProvider = {
  provide: OrderClientService,
  // due to the ActivatedRoute dependency this must be injected in the components
  deps: [HttpClient, ActivatedRoute],
  useFactory: (httpClient: HttpClient, route: ActivatedRoute): OrderClientService => {
    const customerId = route.snapshot.params['customerId'];
    if(CACHED_VALUE !== undefined) {
      if(CACHED_VALUE?.customerId === customerId) {
        return CACHED_VALUE;
      }
      else {
        CACHED_VALUE.ngOnDestroy();
      }
    }
    CACHED_VALUE = new OrderClientService(httpClient, customerId);
    return CACHED_VALUE;
  },
};
