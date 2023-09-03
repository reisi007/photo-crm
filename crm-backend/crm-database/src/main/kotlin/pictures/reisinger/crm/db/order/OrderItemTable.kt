package pictures.reisinger.crm.db.order

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.*
import pictures.reisinger.crm.db.customer.CustomerTable
import java.math.BigDecimal
import java.util.*

internal object OrderItemTable : UUIDTable() {
    val order = reference("offer", OrderTable, onUpdate = ReferenceOption.CASCADE, onDelete = ReferenceOption.CASCADE)
    val name = varchar("name", 100)
    val quantity = integer("quantity")
    val price = decimal("price", 10, 2)
}

class OrderItem(id: EntityID<UUID>) : UUIDEntity(id) {
    companion object : UUIDEntityClass<OrderItem>(OrderItemTable)

    var name by OrderItemTable.name
    var order by Order referencedOn OrderItemTable.order
    var price by OrderItemTable.price
    var quantity by OrderItemTable.quantity
    val totalPrice
        get() = price.times(BigDecimal.valueOf(quantity.toLong()))
}


/**
 * Constructs an expression representing the total price of an order.
 *
 * This method calculates the total price by multiplying the price of each order item by its quantity,
 * and then sums up the results.
 *
 * @return An expression representing the total price of an order.
 */
fun totalPriceExpression(): ExpressionAlias<BigDecimal?> = Expression.build {
    OrderItemTable.price * OrderItemTable.quantity.castTo(DecimalColumnType(10, 2))
}.sum().alias("totalPrice")

fun SqlExpressionBuilder.orderItemPredicate(orderItemId: UUID?, orderId: Long?): Op<Boolean> {
    return OrderItemTable.id.eq(orderItemId) and OrderItemTable.order.eq(orderId)
}
