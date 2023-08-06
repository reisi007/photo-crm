package pictures.reisinger.crm


import assertk.Assert
import assertk.all
import assertk.assertions.isEqualTo
import assertk.assertions.prop
import pictures.reisinger.crm.rest.dao.CompanyDao
import pictures.reisinger.crm.rest.dao.asCompanyDao
import java.math.BigDecimal
import kotlin.test.Test

class CompanyTest {

    @Test
    fun insertCompany() = crmTest {
        val company = sampleCompany()

        postJson(COMPANY_URL, listOf(company)).isNoContent()
        getJson<CompanyDao>("$COMPANY_URL/${company.id}").isSuccessContent {
            getData().assertCompanyDao(company.asCompanyDao(BigDecimal.ZERO))
        }
    }
}



private fun Assert<CompanyDao>.assertCompanyDao(expected: CompanyDao) = all {
    prop(CompanyDao::id).isEqualTo(expected.id)
    prop(CompanyDao::name).isEqualTo(expected.name)
    prop(CompanyDao::address).isEqualTo(expected.address)
    prop(CompanyDao::lifetimeValue).isEqualTo(expected.lifetimeValue)
}
