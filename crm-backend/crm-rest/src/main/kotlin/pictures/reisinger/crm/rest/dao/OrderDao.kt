package pictures.reisinger.crm.rest.dao

import io.ks3.java.math.BigDecimalAsString
import kotlinx.serialization.Serializable
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.insertOrUpdate
import pictures.reisinger.crm.db.order.*
import pictures.reisinger.crm.db.order.OrderStatus.*
import pictures.reisinger.crm.rest.Id

@Serializable
data class OrderDao(
    override var id: UUIDAsString?,
    var status: SerializableOrderStatus,
    var items: List<OrderItemDao>,
    val customerId: UUIDAsString,
    val totalPrice: BigDecimalAsString
) : Id<UUIDAsString?>

@Serializable
data class OrderItemDao(
    override var id: UUIDAsString?,
    var name: String,
    var price: BigDecimalAsString,
    var quantity: Int,
    val orderId: UUIDAsString
) : Id<UUIDAsString?> {

    val totalPrice
        get() = price * quantity.toBigDecimal()
}

@Serializable
enum class SerializableOrderStatus {
    PENDING,
    ACCEPTED,
    DECLINED,
    PAYMENT_PENDING,
    COMPLETED
}

fun OrderStatus.toDao(): SerializableOrderStatus = when (this) {
    PENDING -> SerializableOrderStatus.PENDING
    ACCEPTED -> SerializableOrderStatus.ACCEPTED
    DECLINED -> SerializableOrderStatus.DECLINED
    PAYMENT_PENDING -> SerializableOrderStatus.PAYMENT_PENDING
    COMPLETED -> SerializableOrderStatus.COMPLETED
}

fun SerializableOrderStatus.toEntity(): OrderStatus = when (this) {
    SerializableOrderStatus.PENDING -> PENDING
    SerializableOrderStatus.ACCEPTED -> ACCEPTED
    SerializableOrderStatus.DECLINED -> DECLINED
    SerializableOrderStatus.PAYMENT_PENDING -> PAYMENT_PENDING
    SerializableOrderStatus.COMPLETED -> COMPLETED
}


fun OrderItem.toDao(order: Order) = OrderItemDao(
    id.value,
    name,
    price,
    quantity,
    order.id.value
)

fun OrderItemDao.toEntity(order: Order) =
    OrderItem.insertOrUpdate(id, selectExpression = { orderItemPredicate(id, order.id.value) }) {
        it.name = name
        it.price = price
        it.quantity = quantity
        it.order = order
    }

fun Order.toDao() = OrderDao(
    id.value,
    status.toDao(),
    items.map { it.toDao(this) },
    customer.id.value,
    totalPrice
)

fun OrderDao.toEntity(): Order {
    val order = Order.insertOrUpdate(id, selectExpression = { orderPredicate(it, customerId) }) { order ->
        order.status = status.toEntity()
        order.customer = Customer[customerId]
    }
    items.updateChildren(order.items) {
        OrderItem.insertOrUpdate(
            id,
            selectExpression = { orderItemPredicate(it, id) }) { item ->
            item.name = name
            item.price = price
            item.quantity = quantity
            item.order = order
        }
    }
    return order


}


