package pictures.reisinger.crm


import assertk.Assert
import assertk.all
import assertk.assertions.each
import assertk.assertions.isEqualByComparingTo
import assertk.assertions.isEqualTo
import assertk.assertions.prop
import pictures.reisinger.crm.rest.dao.OrderDao
import pictures.reisinger.crm.rest.dao.OrderItemDao
import kotlin.test.Test


class OrderItemTest {

    @Test
    fun calculateValueOfOrder() = crmTest {
        val (customer, order) = sampleCustomerWithOrder()

        postJson(CUSTOMER_URL, listOf(customer)).isNoContent()
        postJson(ORDERS_URL, listOf(order)).isNoContent()

        getJson<OrderDao>("${ORDERS_URL}/${order.id}").isSuccessContent {
            getData().all {
                assertOrderDao(order)
            }
        }
    }
}

private fun Assert<OrderDao>.assertOrderDao(expected: OrderDao) = all {
    prop(OrderDao::id).isEqualTo(expected.id)
    prop(OrderDao::status).isEqualTo(expected.status)
    prop(OrderDao::customerId).isEqualTo(expected.customerId)

    prop(OrderDao::items)
        .transform { expected.items.zip(it) }
        .each { it.assertOrderItemDao() }

    prop(OrderDao::totalPrice).isEqualByComparingTo(expected.totalPrice)
}

private fun Assert<Pair<OrderItemDao, OrderItemDao>>.assertOrderItemDao() = all {
    propPair(OrderItemDao::id).areEqual()
    propPair(OrderItemDao::name).areEqual()
    propPair(OrderItemDao::price).areBigDecimalsEqual()
    propPair(OrderItemDao::quantity).areEqual()
    propPair(OrderItemDao::orderId).areEqual()
}



