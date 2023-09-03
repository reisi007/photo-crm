package pictures.reisinger.crm.db.order

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.*
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.customer.CustomerTable
import java.math.BigDecimal
import java.util.*

internal object OrderTable : LongIdTable() {
    val status = customEnumeration(
        "status",
        "TEXT",
        { OrderStatus.valueOf(it.toString()) },
        { it.name })
    val customer =
        reference("customer", CustomerTable, onUpdate = ReferenceOption.CASCADE, onDelete = ReferenceOption.NO_ACTION)
}

enum class OrderStatus {
    PENDING,
    ACCEPTED,
    DECLINED,
    PAYMENT_PENDING,
    COMPLETED
}

class Order(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Order>(OrderTable)

    var status by OrderTable.status
    val items by OrderItem referrersOn OrderItemTable.order
    var customer by Customer referencedOn OrderTable.customer

    val totalPrice: BigDecimal
        get() {
            val totalPrice = totalPriceExpression()

            return (OrderTable innerJoin OrderItemTable)
                .slice(OrderTable.id, totalPrice)
                .select { OrderTable.id eq id }
                .groupBy(OrderTable.id)
                .mapNotNull { it[totalPrice] }
                .sumOf { it }
        }


}

fun SqlExpressionBuilder.orderPredicate(orderId: Long?, customerId: UUID?): Op<Boolean> {
    return OrderTable.id.eq(orderId) and onlyFromCustomer(customerId)
}

fun SqlExpressionBuilder.onlyFromCustomer(customerId: UUID?): Op<Boolean> {
    return OrderTable.customer.eq(customerId)
}
