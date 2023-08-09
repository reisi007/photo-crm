import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, NonNullableFormBuilder} from '@angular/forms';
import {UpdateCompany} from '../../shared/http-clients/types';

@Component({
  selector: 'app-update-company-form',
  templateUrl: './update-company-form.component.html',
  styleUrls: ['./update-company-form.component.css'],
})
export class UpdateCompanyComponent implements OnInit {
  public updateCompanyForm!: FormGroup<UpdateCompanyFormControls>;

  @Input()
  data?: UpdateCompany;

  constructor(private readonly formBuilder: NonNullableFormBuilder) {
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
        name: this.formBuilder.control<string>(data?.name ?? ''),
        address: this.formBuilder.group({
          street: this.formBuilder.control<string>(address?.street ?? ''),
          plz: this.formBuilder.control<number>(address?.plz ?? 0),
          city: this.formBuilder.control<string>(address?.city ?? ''),
          country: this.formBuilder.control<string>(address?.country ?? ''),
        }),
      },
    );
  }
}

type UpdateCompanyFormControls = {
  name: FormControl<string>,
  address?: FormGroup<UpdateAddressFormControls>
}

type UpdateAddressFormControls = {
  street: FormControl<string>,
  plz: FormControl<number>,
  city: FormControl<string>,
  country: FormControl<string>,
}
