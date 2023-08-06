package pictures.reisinger.crm.db.commons

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import java.util.*

internal object AddressTable : UUIDTable() {
    val phone = varchar("phone", 50)
    val email = varchar("email", 150)
    val street = varchar("street", 150)
    val plz = varchar("plz", 10)
    val city = varchar("city", 100)
    val country = varchar("country", 100)
}

class Address(id: EntityID<UUID>) : UUIDEntity(id) {
    companion object : UUIDEntityClass<Address>(AddressTable)

    var phone by AddressTable.phone
    var email by AddressTable.email
    var street by AddressTable.street
    var plz by AddressTable.plz
    var city by AddressTable.city
    var country by AddressTable.country
}
