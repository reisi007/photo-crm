package pictures.reisinger.crm.rest.dao

import io.ks3.java.math.BigDecimalAsString
import io.ks3.java.`typealias`.LocalDateAsString
import kotlinx.serialization.Serializable
import pictures.reisinger.crm.db.company.Company
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.customer.customerPredicate
import pictures.reisinger.crm.db.insertOrUpdate
import pictures.reisinger.crm.rest.Id

@Serializable
data class CustomerDao(
    override var id: UUIDAsString?,
    var name: String,
    var birthday: LocalDateAsString,
    var phone: String,
    var email: String,
    var address: AddressDao? = null,
    var company: CompanyDao? = null,
    val orders: List<OrderDao>,
    val lifetimeValue: BigDecimalAsString
) : Id<UUIDAsString?>

@Serializable
data class CustomerUpdateDao(
    override var id: UUIDAsString?,
    var name: String,
    var phone: String,
    var email: String,
    var birthday: LocalDateAsString,
    var address: AddressDao? = null,
    var company: CompanyUpdateDao? = null,
) : Id<UUIDAsString?>


fun Customer.toDao(): CustomerDao {
    val company = company?.toDao()
    return CustomerDao(
        id = id.value,
        name = name,
        birthday = birthday,
        phone = phone,
        email = email,
        address = address?.toDao() ?: company?.address,
        company = company,
        lifetimeValue = lifetimeValue,
        orders = orders.map { it.toDao() }
    )
}

fun CustomerUpdateDao.toEntity() = Customer.insertOrUpdate(id, selectExpression = { customerPredicate(it) }) {
    it.name = name
    it.birthday = birthday
    it.phone = phone
    it.email = email
    it.address = address?.toEntity(it.id.value)
    it.company = company?.id?.let { companyId -> Company[companyId] }
}

