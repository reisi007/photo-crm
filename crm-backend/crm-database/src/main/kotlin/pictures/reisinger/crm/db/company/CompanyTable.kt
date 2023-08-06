package pictures.reisinger.crm.db.company

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.SqlExpressionBuilder
import org.jetbrains.exposed.sql.select
import pictures.reisinger.crm.db.commons.Address
import pictures.reisinger.crm.db.commons.AddressTable
import pictures.reisinger.crm.db.customer.Customer
import pictures.reisinger.crm.db.customer.CustomerTable
import pictures.reisinger.crm.db.order.OrderItemTable
import pictures.reisinger.crm.db.order.OrderTable
import pictures.reisinger.crm.db.order.totalPriceExpression
import java.math.BigDecimal
import java.util.*

internal object CompanyTable : UUIDTable() {
    val name = varchar("name", 100)
    val address =
        reference("address", AddressTable, onDelete = ReferenceOption.CASCADE, onUpdate = ReferenceOption.CASCADE)

}

class Company(id: EntityID<UUID>) : UUIDEntity(id) {
    companion object : UUIDEntityClass<Company>(CompanyTable)

    var name by CompanyTable.name
    var address by Address referencedOn CompanyTable.address
    val customers by Customer optionalReferrersOn CustomerTable.company

    val lifetimeValue: BigDecimal
        get() {
            val totalPrice = totalPriceExpression()

            return (CompanyTable innerJoin CustomerTable innerJoin OrderTable innerJoin OrderItemTable)
                .slice(CompanyTable.id, totalPrice)
                .select { CompanyTable.id eq id }
                .groupBy(CompanyTable.id)
                .mapNotNull { it[totalPrice] }
                .sumOf { it }
        }


}

fun SqlExpressionBuilder.companyPredicate(companyId: UUID?): Op<Boolean> = CompanyTable.id.eq(companyId)
