import {Component, Input} from '@angular/core';
import {HttpErrorResponseDetails} from '../types';

@Component({
  selector: 'app-rest-error',
  templateUrl: './rest-error.component.html',
  styleUrls: ['./rest-error.component.css'],
})
export class RestErrorComponent {

  @Input()
  error?: HttpErrorResponseDetails | null;

}
