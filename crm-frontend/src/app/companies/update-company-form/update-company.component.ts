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
import {getAddress, UpdateAddressFormControls} from '../../UpdateAddressFormControls';


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
    const data = this.data;
    this.updateCompanyForm = this.formBuilder.group<UpdateCompanyFormControls>(
      {
        name: this.formBuilder.control<string>(data?.name ?? '', {
          validators: [Validators.required, Validators.minLength(1)],
        }),
        address: getAddress(this.formBuilder, data?.address),
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
  address: FormGroup<UpdateAddressFormControls>
}


