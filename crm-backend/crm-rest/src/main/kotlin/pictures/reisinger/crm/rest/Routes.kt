package pictures.reisinger.crm.rest

import io.ktor.server.application.ApplicationCall
import io.ktor.server.routing.Route
import pictures.reisinger.crm.db.company.Company
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.order.Order
import pictures.reisinger.crm.db.order.onlyFromCustomer
import pictures.reisinger.crm.rest.dao.*
import java.util.*

private const val CUSTOMER_ID = "{customerId}"

fun Route.registerCompanyRoutes() = crudRoutes(
    "companies",
    Company,
    Company::toDao,
    CompanyUpdateDao::toEntity
)

fun Route.registerCustomerRoutes() = crudRoutes(
    "customers",
    Customer,
    Customer::toDao,
    CustomerUpdateDao::toEntity
)

fun Route.registerOrderRoutes(): Route {
    return crudRoutes(
        "customers/{$CUSTOMER_ID}/orders",
        Order,
        Order::toDao,
        OrderUpdateDao::toEnityWithRouteInformation,
        findAll = { call -> find { onlyFromCustomer(call.getCustomerIdFromParameters()) } },
        ensureUpdateDaoFitsPath = { call -> customerId = call.getCustomerIdFromParameters() }

    )
}

private inline fun <reified T : Any> ApplicationCall.getCustomerIdFromParameters() = getIdFromParameters<T>(CUSTOMER_ID)


private fun OrderUpdateDao.toEnityWithRouteInformation(call: ApplicationCall): Order {
    val customerId: UUID = call.getCustomerIdFromParameters()
    return toEntity(customerId)
}
