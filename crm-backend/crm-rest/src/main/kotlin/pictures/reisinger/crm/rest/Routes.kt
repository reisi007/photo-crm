package pictures.reisinger.crm.rest

import io.ktor.server.application.ApplicationCall
import io.ktor.server.routing.Route
import pictures.reisinger.crm.db.company.Company
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.order.Order
import pictures.reisinger.crm.db.order.onlyFromCustomer
import pictures.reisinger.crm.rest.dao.*


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

fun Route.registerOrderRoutes() =
    crudRoutes(
        "customers/{customerId}/orders",
        Order,
        Order::toDao,
        OrderDao::toEntity,
        findAll = { call -> find { onlyFromCustomer(call.getCustomerIdFromParameters()) } },
        ensureUpdateDaoFitsPath = { call -> customerId = call.getCustomerIdFromParameters() }

    )

private fun ApplicationCall.getCustomerIdFromParameters() = getIdFromParameters("customerId")
