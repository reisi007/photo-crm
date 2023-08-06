package pictures.reisinger.crm.rest

import io.ktor.server.routing.Route
import pictures.reisinger.crm.db.company.Company
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.order.Order
import pictures.reisinger.crm.rest.dao.*


fun Route.registerCompanyRoutes() = crudRoutes("companies", Company, Company::toDao, CompanyUpdateDao::toEntity)

fun Route.registerCustomerRoutes() = crudRoutes("customers", Customer, Customer::toDao, CustomerUpdateDao::toEntity)

fun Route.registerOrderRoutes() = crudRoutes("orders", Order, Order::toDao, OrderDao::toEntity)
