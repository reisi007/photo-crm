import {Component, Input, OnInit} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ɵFormGroupValue,
  ɵTypedOrUntyped,
} from '@angular/forms';
import {OnDestroyable} from '../../../shared/OnDestroyable';
import {
  HttpErrorResponseDetails,
  JavaBigDecimal,
  SerializableOrderStatus,
  UpdateOrder,
  UpdateOrderItem,
} from '../../../shared/http-clients/types';
import {OrderClientService} from '../../../shared/http-clients/order-client.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderClientProvider} from '../OrderClientProvider';

@Component({
  selector: 'app-update-order-form',
  templateUrl: './update-order-form.component.html',
  styleUrls: ['./update-order-form.component.css'],
  providers: [OrderClientProvider],
})
export class UpdateOrderFormComponent extends OnDestroyable implements OnInit {
  updateOrderForm!: FormGroup<UpdateOrderFormControls>;
  protected lastError?: HttpErrorResponseDetails;

  @Input()
  data?: UpdateOrder;

  @Input()
  customerId!: string;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private orderClient: OrderClientService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  /**
   * Calculates the total sum of the items in the update order form.
   *
   * @param {number} [idx] - Optional parameter to filter items by index.
   * @returns {number} - The total sum of the items' quantities multiplied by their prices.
   */
  total(idx?: number) {
    const items = this.updateOrderForm.value.items as Array<UpdateOrderItem>;
    if(items === undefined) {
      return 0;
    }
    const filteredItems = idx === undefined ? items : items.filter((_, itemIdx) => idx === itemIdx);

    let sum = 0;

    filteredItems.forEach(item => {
      sum += item.quantity * parseInt(item.price, 10);
    });

    return sum;
  }

  ngOnInit() {
    const data = this.data;
    const items = (data?.items ?? [undefined]).map(item => this.createItem(item));

    this.updateOrderForm = this.formBuilder.group<UpdateOrderFormControls>({
      id: this.formBuilder.control<number | undefined>(data?.id),
      customerId: this.formBuilder.control<string | undefined>(data?.customerId ?? this.customerId),
      status: this.formBuilder.control<SerializableOrderStatus>(data?.status ?? SerializableOrderStatus.PENDING, Validators.required),
      items: this.formBuilder.array(items),
    });
  }

  get itemForms(): FormArray<FormGroup<UpdateOrderItemFormControls>> {
    return this.updateOrderForm.get('items') as FormArray<FormGroup<UpdateOrderItemFormControls>>;
  }

  // Create a form group for an item
  private createItem(data?: UpdateOrderItem): FormGroup<UpdateOrderItemFormControls> {
    return this.formBuilder.group<UpdateOrderItemFormControls>({
      id: this.formBuilder.control<string | undefined>(data?.id),
      name: this.formBuilder.control(data?.name, Validators.required),
      price: this.formBuilder.control(data?.price ?? '10', [Validators.required, Validators.pattern(/-?\d+(\.\d+)?/)]),
      quantity: this.formBuilder.control(data?.quantity ?? 1, [Validators.required, Validators.min(1)]),
    });
  }

  // Add new group to items array
  public addOrderItem(): void {
    this.itemForms.push(this.createItem());
  }

  // Remove group from items array by index
  public deleteOrderItem(index: number): void {
    if(this.itemForms.length > 1) { // Ensure there's always one item
      this.itemForms.removeAt(index);
    }
  }

  public onSubmit(value: ɵTypedOrUntyped<UpdateOrderFormControls, ɵFormGroupValue<UpdateOrderFormControls>, UpdateOrderFormControls>) {
    const order = value as UpdateOrder;

    this.orderClient.updateOne(order).subscribe({
      error: error => this.lastError = error,
      next: async () => {
        this.lastError = undefined;
        this.orderClient.refresh();
        await this.router.navigate(['../'], {relativeTo: this.route});
      },
    });
  }

  protected readonly orderStatus: Array<SerializableOrderStatus> = [
    SerializableOrderStatus.PENDING,
    SerializableOrderStatus.ACCEPTED,
    SerializableOrderStatus.DECLINED,
    SerializableOrderStatus.PAYMENT_PENDING,
    SerializableOrderStatus.COMPLETED,
  ];
}

type UpdateOrderFormControls = {
  id: FormControl<number | undefined>,
  customerId: FormControl<string | undefined>,
  status: FormControl<SerializableOrderStatus>,
  items: FormArray<FormGroup<UpdateOrderItemFormControls>>
}

type UpdateOrderItemFormControls = {
  id: FormControl<string | undefined>,
  name: FormControl<string | undefined>,
  price: FormControl<JavaBigDecimal | ''>,
  quantity: FormControl<number>,
}
