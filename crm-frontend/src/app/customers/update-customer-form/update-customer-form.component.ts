import {Component, Input, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ɵFormGroupValue,
  ɵTypedOrUntyped,
} from '@angular/forms';
import {Company, HttpErrorResponseDetails, UpdateCompany, UpdateCustomer} from '../../shared/http-clients/types';
import {getAddress, UpdateAddressFormControls} from '../../UpdateAddressFormControls';
import {CompanyClientService} from '../../shared/http-clients/company-client.service';
import {CustomerClientService} from '../../shared/http-clients/customer-client.service';
import {OnDestroyable} from '../../shared/OnDestroyable';

@Component({
  selector: 'app-update-customer-form',
  templateUrl: './update-customer-form.component.html',
  styleUrls: ['./update-customer-form.component.css'],
})
export class UpdateCustomerFormComponent extends OnDestroyable implements OnInit {
  public updateCustomerForm!: FormGroup<UpdateCustomerFormControls>;
  protected lastError?: HttpErrorResponseDetails;

  @Input()
  data?: UpdateCustomer;

  companies?: Array<Company>;


  constructor(
    private companyClient: CompanyClientService,
    private customerClient: CustomerClientService,
    private formBuilder: NonNullableFormBuilder,
  ) {
    super();
  }

  onSubmit(value: ɵTypedOrUntyped<UpdateCustomerFormControls, ɵFormGroupValue<UpdateCustomerFormControls>, any>) {

  }

  ngOnInit(): void {
    this.companyClient.getAll().subscribe(value => {
      if(value.success === null) {
        return;
      }
      this.companies = value.success;
    });

    const data = this.data;
    this.updateCustomerForm = this.formBuilder.group<UpdateCustomerFormControls>(
      {
        name: this.formBuilder.control<string>(data?.name ?? '', {
          validators: [Validators.required, Validators.minLength(1)],
        }),
        birthday: this.formBuilder.control<Date | ''>(data?.birthday ?? '', {
          validators: [Validators.required],
        }),
        address: getAddress(this.formBuilder, data?.address),
        phone: this.formBuilder.control<string>(data?.phone ?? ''),
        email: this.formBuilder.control<string>(data?.email ?? ''),
        company: this.formBuilder.control<UpdateCompany|"">(data?.company ?? ''),
      },
    );
  }
}


type UpdateCustomerFormControls = {
  name: FormControl<string>,
  birthday: FormControl<Date | ''>,
  phone: FormControl<string>,
  email: FormControl<string>,
  address?: FormGroup<UpdateAddressFormControls>
  company: FormControl<UpdateCompany|"">
}
