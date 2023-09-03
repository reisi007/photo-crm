import {Component, Input} from '@angular/core';
import {Customer, Order, UpdateAddress} from '../../../shared/http-clients/types';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css'],
})
export class PrintOrderComponent {

  @Input()
  order?: Order;

  @Input()
  customer?: Customer;

  me: { name: string, address: UpdateAddress } = {
    name: 'Florian Reisinger',
    address: {
      street: 'Robert-Stolz-Straße 8',
      plz: 4020,
      city: 'Linz',
      country: 'Österreich',
    },
  };

  paymentTerms = 'Keine Umsatzsteuer gemäß § 6 Abs. 1 Z. 27 UStG. Zahlbar nach Rechnungslegung binnen 14 Tagen ohne Abzug von Skonto.';

  protected readonly parseInt = parseInt;
}
