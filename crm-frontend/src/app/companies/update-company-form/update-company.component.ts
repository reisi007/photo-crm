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
  HttpErrorResponseDetails,
  objectOrUndefined,
  UpdateAddress,
  UpdateCompany,
} from '../../shared/http-clients/types';
import {CompanyClientService} from '../../shared/http-clients/company-client.service';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-update-company-form',
  templateUrl: './update-company-form.component.html',
  styleUrls: ['./update-company-form.component.css'],
})
export class UpdateCompanyComponent implements OnInit {
  public updateCompanyForm!: FormGroup<UpdateCompanyFormControls>;
  protected lastError?: HttpErrorResponseDetails;

  @Input()
  data?: UpdateCompany;

  constructor(
    private readonly formBuilder: NonNullableFormBuilder,
    private readonly companyRestClient: CompanyClientService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Method to initialize update company form
  private initializeForm(): void {
    const data = this.data;
    const address = data?.address;

    this.updateCompanyForm = this.formBuilder.group<UpdateCompanyFormControls>(
      {
        name: this.formBuilder.control<string>(data?.name ?? '', {
          validators: [Validators.required, Validators.minLength(1)],
        }),
        address: this.formBuilder.group({
          street: this.formBuilder.control<string>(address?.street ?? '', {
            validators: [Validators.required, Validators.minLength(1)],
          }),
          plz: this.formBuilder.control<number | ''>(address?.plz ?? '', {
            validators: [Validators.required, Validators.min(1000)],
          }),
          city: this.formBuilder.control<string>(address?.city ?? '', {
            validators: [Validators.required, Validators.minLength(1)],
          }),
          country: this.formBuilder.control<string>(address?.country ?? '', {
            validators: [Validators.required, Validators.minLength(1)],
          }),
        }),
      },
    );
  }

  onSubmit(value: ɵTypedOrUntyped<UpdateCompanyFormControls, ɵFormGroupValue<UpdateCompanyFormControls>, UpdateCompanyFormControls>) {
    if(!this.updateCompanyForm.valid) {
      return;
    }
    const updated = value as UpdateCompany;
    updated.address = objectOrUndefined<UpdateAddress>(updated.address);

    this.companyRestClient.updateOne(updated).subscribe({
      error: error => this.lastError = error,
      next: async () => {
        this.lastError = undefined;
        await this.router.navigate(['../'], {relativeTo: this.route});
      },
    });
  }


}

type UpdateCompanyFormControls = {
  name: FormControl<string>,
  address?: FormGroup<UpdateAddressFormControls>
}

type UpdateAddressFormControls = {
  street: FormControl<string>,
  plz: FormControl<number | ''>,
  city: FormControl<string>,
  country: FormControl<string>,
}
