package pictures.reisinger.crm.rest.dao

import io.ks3.java.math.BigDecimalAsString
import io.ktor.server.application.ApplicationCall
import kotlinx.serialization.Serializable
import pictures.reisinger.crm.db.company.Company
import pictures.reisinger.crm.db.company.companyPredicate
import pictures.reisinger.crm.db.insertOrUpdate
import pictures.reisinger.crm.rest.Id
import java.math.BigDecimal

@Serializable
data class CompanyDao(
    override var id: UUIDAsString?,
    var name: String,
    var address: AddressDao,
    val lifetimeValue: BigDecimalAsString
) : Id<UUIDAsString?>

@Serializable
data class CompanyUpdateDao(override var id: UUIDAsString?, var name: String, var address: AddressDao) :
    Id<UUIDAsString?>


fun Company.toDao() = CompanyDao(
    id = id.value,
    name = name,
    address = address.toDao(),
    lifetimeValue = lifetimeValue
)


fun CompanyUpdateDao.toEntity(call: ApplicationCall): Company =
    Company.insertOrUpdate(id, selectExpression = { companyPredicate(id) }) {
        it.name = name
        it.address = address.toEntity(it.id.value)
    }

fun CompanyUpdateDao.asCompanyDao(lifetimeValue: BigDecimal): CompanyDao {
    return CompanyDao(id, name, address, lifetimeValue)
}
