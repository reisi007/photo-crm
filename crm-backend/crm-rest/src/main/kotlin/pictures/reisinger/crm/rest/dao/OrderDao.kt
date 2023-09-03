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
    override var id: Long?,
    var status: SerializableOrderStatus,
    var items: List<OrderItemDao>,
    var customerId: UUIDAsString,
    var totalPrice: BigDecimalAsString
) : Id<Long?>

@Serializable
data class OrderUpdateDao(
    override var id: Long?,
    var status: SerializableOrderStatus,
    var items: List<OrderUpdateItemDao>,
    var customerId: UUIDAsString?,
) : Id<Long?>

@Serializable
data class OrderItemDao(
    override var id: UUIDAsString?,
    var name: String,
    var price: BigDecimalAsString,
    var quantity: Int,
    val orderId: Long?
) : Id<UUIDAsString?> {

    val totalPrice
        get() = price * quantity.toBigDecimal()
}

@Serializable
data class OrderUpdateItemDao(
    override var id: UUIDAsString?,
    var name: String,
    var price: BigDecimalAsString,
    var quantity: Int
) : Id<UUIDAsString?>

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

fun Order.toDao() = OrderDao(
    id.value,
    status.toDao(),
    items.map { it.toDao(this) },
    customer.id.value,
    totalPrice
)

fun OrderUpdateDao.toEntity(uuidFromPath: UUIDAsString): Order {
    val order = Order.insertOrUpdate(id, selectExpression = { orderPredicate(it, uuidFromPath) }) { order ->
        order.status = status.toEntity()
        order.customer = Customer[uuidFromPath]
    }
    items.updateChildren(order.items) {
        OrderItem.insertOrUpdate(
            id,
            selectExpression = { orderItemPredicate(it, order.id.value) }) { item ->
            item.name = name
            item.price = price
            item.quantity = quantity
            item.order = order
        }
    }
    return order


}


