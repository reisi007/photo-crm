package pictures.reisinger.crm

import pictures.reisinger.crm.rest.dao.*
import java.math.BigDecimal
import java.time.LocalDate
import java.util.*

fun sampleCompany(uuid: String = "816e8400-f29f-11d4-a316-446655140000"): CompanyUpdateDao {
    return CompanyUpdateDao(
        id = UUID.fromString(uuid),
        name = "Test Company Name",
        address = sampleAddress(uuid)
    )
}

private fun sampleAddress(uuid: String) = AddressDao(
    id = UUID.fromString(uuid),
    street = "1 Network Drive",
    plz = 12345,
    city = "Testville",
    country = "Testland"
)

fun sampleCustomerWithOrder(): Pair<CustomerUpdateDao, OrderDao> {
    val customerId = UUID.fromString("47ac10b-58cc-4372-a567-0e02b2c3d479")
    val customerUpdateDao = CustomerUpdateDao(
        id = customerId,
        name = "John Doe",
        phone = "0123456789",
        email = "test@example.com",
        birthday = LocalDate.of(1995, 5, 23),
    )


    val orderId = 254L
    val orderItems = listOf(
        OrderItemDao(
            id = UUID.fromString("f47ac10b-58cc-4372-a567-0e02b2c3d479"),
            name = "Shampoo",
            price = BigDecimal("20.5"),
            quantity = 2,
            orderId = orderId
        ),
        OrderItemDao(
            id = UUID.fromString("d3dd90e7-d999-4d4b-b72a-bfd3485e3434"),
            name = "Soap",
            price = BigDecimal("5.2"),
            quantity = 10,
            orderId = orderId
        ),
        OrderItemDao(
            id = UUID.fromString("056f789e-cd3d-4327-ac4b-efb482ad8f8f"),
            name = "Conditioner",
            price = BigDecimal("25"),
            quantity = 1,
            orderId = orderId
        ),
        OrderItemDao(
            id = UUID.fromString("0f14d140-abfb-4578-94ea-5de640488fe4"),
            name = "Toothpaste",
            price = BigDecimal("15.01"),
            quantity = 3,
            orderId = orderId
        ),
        OrderItemDao(
            id = UUID.fromString("cd2bfc03-7e55-4883-9fde-d80ae02cc57f"),
            name = "Body Wash",
            price = BigDecimal("0.99"),
            quantity = 4,
            orderId = orderId
        )
    )
    val orderDao = OrderDao(
        id = orderId,
        status = SerializableOrderStatus.COMPLETED,
        items = orderItems,
        customerId = customerId,
        totalPrice = BigDecimal("166.99")
    )
    return customerUpdateDao to orderDao
}
