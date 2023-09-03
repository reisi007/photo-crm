import {Component, Input} from '@angular/core';
import {UpdateAddress} from '../../../../shared/http-clients/types';

@Component({
  selector: 'app-print-address',
  templateUrl: './print-address.component.html',
  styleUrls: ['./print-address.component.css'],
})
export class PrintAddressComponent {
  @Input()
  address!: UpdateAddress;
}
