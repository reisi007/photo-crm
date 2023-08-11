import {Component, Input, OnInit} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ɵFormGroupValue,
  ɵTypedOrUntyped,
} from '@angular/forms';
import {
  Company,
  HttpErrorResponseDetails,
  objectOrUndefined,
  UpdateCompany,
  UpdateCustomer,
} from '../../shared/http-clients/types';
import {getAddress, UpdateAddressFormControls} from '../../UpdateAddressFormControls';
import {CompanyClientService} from '../../shared/http-clients/company-client.service';
import {CustomerClientService} from '../../shared/http-clients/customer-client.service';
import {OnDestroyable} from '../../shared/OnDestroyable';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-update-customer-form',
  templateUrl: './update-customer-form.component.html',
  styleUrls: ['./update-customer-form.component.css'],
})
export class UpdateCustomerFormComponent extends OnDestroyable implements OnInit {
  public updateCustomerForm!: FormGroup<UpdateCustomerFormControls>;
  protected lastError?: HttpErrorResponseDetails;
  protected lastCompanyError?: HttpErrorResponseDetails;

  @Input()
  data?: UpdateCustomer;

  companies?: Array<Company>;


  constructor(
    private companyClient: CompanyClientService,
    private customerClient: CustomerClientService,
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  onSubmit(value: ɵTypedOrUntyped<UpdateCustomerFormControls, ɵFormGroupValue<UpdateCustomerFormControls>, UpdateCustomerFormControls>) {
    const updateCustomer = value as UpdateCustomer;
    updateCustomer.address = objectOrUndefined(updateCustomer.address);
    updateCustomer.company = objectOrUndefined(updateCustomer.company);

    this.customerClient.updateOne(updateCustomer).subscribe({
      error: error => this.lastError = error,
      next: async () => {
        this.lastError = undefined;
        this.customerClient.refresh();
        await this.router.navigate(['../'], {relativeTo: this.route});
      },
    });
  }

  ngOnInit(): void {
    this.companyClient.getAll()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(value => {
          if(value.success === undefined) {
            this.lastCompanyError = value.error;
            this.companies = undefined;
          }
          else {
            this.companies = value.success;
            this.lastCompanyError = undefined;
          }
        });
    this.companyClient.refresh();

    const data = this.data;
    this.updateCustomerForm = this.formBuilder.group<UpdateCustomerFormControls>(
      {
        id: this.formBuilder.control<string | undefined>(data?.id),
        name: this.formBuilder.control<string>(data?.name ?? '', {
          validators: [Validators.required, Validators.minLength(1)],
        }),
        birthday: this.formBuilder.control<Date | ''>(data?.birthday ?? '', {
          validators: [Validators.required],
        }),
        address: getAddress(this.formBuilder, data?.address),
        phone: this.formBuilder.control<string>(data?.phone ?? ''),
        email: this.formBuilder.control<string>(data?.email ?? ''),
        company: this.formBuilder.control<UpdateCompany | ''>(data?.company ?? ''),
      },
    );
  }
}


type UpdateCustomerFormControls = {
  id: FormControl<string | undefined>,
  name: FormControl<string>,
  birthday: FormControl<Date | ''>,
  phone: FormControl<string>,
  email: FormControl<string>,
  address?: FormGroup<UpdateAddressFormControls>
  company: FormControl<UpdateCompany | ''>
}
