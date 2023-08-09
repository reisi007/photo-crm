/**
 * Represents a utility type that allows creating a new type by partially applying
 * the properties of another type.
 *
 * @template T - The original type.
 * @template K - The keys of the properties to be partially applied.
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Represents a utility type for excluding specified properties from a given type.
 *
 * @template T - The type from which properties will be excluded.
 * @template U - The type containing the properties to be excluded.
 */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
/**
 * Represents a type that is exclusive OR (XOR) of two types.
 *
 * @template T - The first type.
 * @template U - The second type.
 * @typedef XOR<T, U>
 * @type {object} - The resulting XOR type.
 * @property {T | U} [T] - The value of type T or U.
 * @property {T} [Without<U, T>] - The value of type T without U.
 * @property {U} [Without<T, U>] - The value of type U without T.
 *
 * @example
 *
 * // USING XOR
 *
 * type A = { propA: string };
 * type B = { propB: number };
 *
 * const value1: XOR<A, B> = { propA: "hello" }; // valid, as it only contains type A properties
 * const value2: XOR<A, B> = { propB: 123 }; // valid, as it only contains type B properties
 *
 * const value3: XOR<A, B> = { propA: "hello", propB: 123 }; // invalid, cannot contain both type A and type B properties
 *
 * // USING XOR WITH UNION OF NON-OBJECT TYPES
 *
 * type C = number;
 * type D = string;
 *
 * const value4: XOR<C, D> = 123; // valid, as it is of type C (number)
 * const value5: XOR<C, D> = "hello"; // valid, as it is of type D (string)
 * const value6: XOR<C, D> = true; // invalid, as it does not match either type C or type D
 */
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
/**
 * The JavaBigDecimal class provides a way to perform accurate arithmetic operations on large decimal numbers
 * with arbitrary precision.
 *
 * @class
 */
type JavaBigDecimal = string

export type Id<T>={id:T}

/**
 * Represents an error object with the specified status code, status description,
 * and optional error message.
 *
 * @typedef {Object} ErrorResponse
 * @property {number} statusCode - The status code of the error.
 * @property {string} statusDescription - The status description of the error.
 * @property {string} [errorMessage] - The optional error message.
 */
export type ErrorResponse = {
  statusCode: number,
  statusDescription: string,
  errorMessage?: string
}

/**
 * Represents an address.
 * @typedef {Object} Address
 * @property {string} id - The unique identifier for the address.
 * @property {string} street - The street name of the address.
 * @property {number} plz - The postal code of the address.
 * @property {string} city - The city of the address.
 * @property {string} country - The country of the address.
 */
export type Address = Id<string> & {
  street: string,
  plz: number,
  city: string,
  country: string
}
/**
 * Represents a class for updating an address.
 *
 * @typedef {Object} Address - The address object.
 * @property {number} [id] - The ID of the address.
 * @property {string} [street] - The street name of the address.
 * @property {string} [city] - The city of the address.
 * @property {string} [state] - The state of the address.
 * @property {string} [country] - The country of the address.
 * @property {string} [postalCode] - The postal code of the address.
 *
 * @typedef {PartialBy<Address, 'id'>} UpdateAddress - The partial address object for updating the address.
 */
export type UpdateAddress = PartialBy<Address, 'id'>

/**
 * Represents a company.
 *
 * @template IAddress - The type of address for the company.
 */
export type Company<IAddress = Address> = Id<string> &  {
  name: string,
  address: IAddress,
  lifetimeValue: JavaBigDecimal
}

/**
 * Represents a function to update a company.
 *
 * @template TAddress - The type of company address.
 * @param {UpdateCompany<TAddress>} companyData - The data for updating the company.
 * @returns {Promise<void>} - A promise that resolves when the company is updated successfully.
 */
export type UpdateCompany = Omit<PartialBy<Company<UpdateAddress>, 'id'>, 'lifetimeValue'>

/**
 * Represents an order.
 *
 * @template Item - The item type in the order.
 */
export type Order<Item extends object = OrderItem> = Id<string> &  {
  status: SerializableOrderStatus,
  items: Array<Item>,
  customerId: string,
  totalPrice: JavaBigDecimal
}

/**
 * Represents an order update with optional fields.
 * @template UpdateOrderItem - The type of the items in the order.
 * @typedef {Omit<PartialBy<Order<UpdateOrderItem>, 'id'>, 'totalPrice'>} UpdateOrder
 */
export type UpdateOrder = Omit<PartialBy<Order<UpdateOrderItem>, 'id'>, 'totalPrice'>

/**
 * Represents an item in an order.
 * @typedef {Object} OrderItem
 * @property {string} id - The unique identifier for the item.
 * @property {string} name - The name of the item.
 * @property {JavaBigDecimal} price - The price of the item.
 * @property {number} quantity - The quantity of the item.
 * @property {string} orderId - The unique identifier of the order to which the item belongs.
 * @property {number} totalPrice - The total price of the item (price * quantity).
 */
export type OrderItem = Id<string> &  {
  name: string,
  price: JavaBigDecimal,
  quantity: number,
  orderId: string,
  totalPrice: number
}

/**
 * Represents an object used to update an order item.
 *
 * @typedef {Omit<PartialBy<OrderItem, 'id' | 'orderId'>, 'totalPrice'>} UpdateOrderItem
 *
 * @property {string} [name] - The updated name of the order item.
 * @property {string} [description] - The updated description of the order item.
 * @property {number} [quantity] - The updated quantity of the order item.
 * @property {number} [price] - The updated price of the order item.
 */
export type  UpdateOrderItem = Omit<PartialBy<OrderItem, 'id' | 'orderId'>, 'totalPrice'>

/**
 * Represents the status of an order that can be serialized.
 *
 * @enum {string}
 */
enum SerializableOrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  COMPLETED = 'COMPLETED'
}


/**
 * Represents a customer.
 *
 * @template IAddress - The type of the address associated with the customer.
 * @template ICompany - The type of the company associated with the customer.
 *
 * @property {string} id - The unique identifier of the customer.
 * @property {string} name - The name of the customer.
 * @property {Date} birthday - The birthday of the customer.
 * @property {string} phone - The phone number of the customer.
 * @property {string} email - The email address of the customer.
 * @property {IAddress} [address] - The address associated with the customer. Optional.
 * @property {ICompany} [company] - The company associated with the customer. Optional.
 */
export type Customer<IAddress extends object = Address, ICompany extends object = Company> =  Id<string> & {
  name: string,
  birthday: Date,
  phone: string,
  email: string,
  address?: IAddress,
  company?: ICompany,
}
/**
 * Represents an interface for updating customer information.
 * @template UpdateAddress - The type of the updated address.
 * @template UpdateCompany - The type of the updated company.
 * @extends {PartialBy<Customer<UpdateAddress, UpdateCompany>, 'id'>}
 */
export type UpdateCustomer = PartialBy<Customer<UpdateAddress, UpdateCompany>, 'id'>
