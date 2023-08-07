package pictures.reisinger.crm.db.commons

import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.UUIDTable
import java.util.*

internal object AddressTable : UUIDTable() {
    val street = varchar("street", 150)
    val plz = integer("plz")
    val city = varchar("city", 100)
    val country = varchar("country", 100)
}

class Address(id: EntityID<UUID>) : UUIDEntity(id) {
    companion object : UUIDEntityClass<Address>(AddressTable)

    var street by AddressTable.street
    var plz by AddressTable.plz
    var city by AddressTable.city
    var country by AddressTable.country
}
