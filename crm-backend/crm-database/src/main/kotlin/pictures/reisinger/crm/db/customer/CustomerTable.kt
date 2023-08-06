package pictures.reisinger.crm.db.customer

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.SqlExpressionBuilder
import org.jetbrains.exposed.sql.javatime.date
import org.jetbrains.exposed.sql.javatime.datetime
import org.jetbrains.exposed.sql.select
import pictures.reisinger.crm.db.commons.Address
import pictures.reisinger.crm.db.commons.AddressTable
import pictures.reisinger.crm.db.company.Company
import pictures.reisinger.crm.db.company.CompanyTable
import pictures.reisinger.crm.db.order.Order
import pictures.reisinger.crm.db.order.OrderItemTable
import pictures.reisinger.crm.db.order.OrderTable
import pictures.reisinger.crm.db.order.totalPriceExpression
import java.math.BigDecimal
import java.util.*

internal object CustomerTable : UUIDTable() {
    val name = varchar("name", 150)
    val birthday = date("birthday")
    val address =
        optReference("address", AddressTable, onDelete = ReferenceOption.CASCADE, onUpdate = ReferenceOption.CASCADE)
    val company =
        optReference("company", CompanyTable, onDelete = ReferenceOption.CASCADE, onUpdate = ReferenceOption.CASCADE)
}


class Customer(id: EntityID<UUID>) : UUIDEntity(id) {
    companion object : UUIDEntityClass<Customer>(CustomerTable)

    var name by CustomerTable.name
    var birthday by CustomerTable.birthday
    var address by Address optionalReferencedOn  CustomerTable.address
    var company by Company optionalReferencedOn CustomerTable.company

    val orders by Order referrersOn OrderTable.customer

    val lifetimeValue: BigDecimal
        get() {
            val totalPrice = totalPriceExpression()

            return (CustomerTable innerJoin OrderTable innerJoin OrderItemTable)
                .slice(CustomerTable.id, totalPrice)
                .select { CustomerTable.id eq id }
                .groupBy(CustomerTable.id)
                .mapNotNull { it[totalPrice] }
                .sumOf { it }
        }
}

fun SqlExpressionBuilder.customerPredicate(customerId: UUID?): Op<Boolean> = CustomerTable.id.eq(customerId)
