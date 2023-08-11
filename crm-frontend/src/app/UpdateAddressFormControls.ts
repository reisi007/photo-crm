import {FormControl, NonNullableFormBuilder, Validators} from '@angular/forms';
import {UpdateAddress} from './shared/http-clients/types';

export type UpdateAddressFormControls = {
  street: FormControl<string>,
  plz: FormControl<number | ''>,
  city: FormControl<string>,
  country: FormControl<string>,
}

export function getAddress(formBuilder: NonNullableFormBuilder, address?: UpdateAddress) {
  return formBuilder.group({
    street: formBuilder.control<string>(address?.street ?? '', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    plz: formBuilder.control<number | ''>(address?.plz ?? '', {
      validators: [Validators.required, Validators.min(1000)],
    }),
    city: formBuilder.control<string>(address?.city ?? '', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    country: formBuilder.control<string>(address?.country ?? '', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });
}
