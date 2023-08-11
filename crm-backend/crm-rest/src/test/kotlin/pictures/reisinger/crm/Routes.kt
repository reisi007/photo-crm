package pictures.reisinger.crm

import pictures.reisinger.crm.rest.dao.UUIDAsString

const val COMPANY_URL = "/rest/companies"
const val CUSTOMER_URL = "/rest/customers"
fun ordersUrl(customerId: UUIDAsString?) = "$CUSTOMER_URL/$customerId/orders"
