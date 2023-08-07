package pictures.reisinger.crm.rest.dao

import kotlinx.serialization.Serializable
import pictures.reisinger.crm.db.commons.Address
import pictures.reisinger.crm.db.insertOrUpdateWithId
import pictures.reisinger.crm.rest.Id

/**
 * Represents a data access object for managing address data in a database.
 *
 * This class provides methods to perform CRUD operations (create, read, update, delete)
 * on address entries stored in the database.
 */
@Serializable
data class AddressDao(
    override var id: UUIDAsString?,
    var street: String,
    var plz: Int,
    var city: String,
    var country: String
) : Id<UUIDAsString?>

/**
 * Converts an [Address] object to an [AddressDao] object.
 *
 * @return The converted [AddressDao] object.
 */
fun Address.toDao() = AddressDao(
    id.value,
    street,
    plz,
    city,
    country
)

/**
 * Converts an instance of [AddressDao] to an instance of [Address].
 *
 * @return The converted [Address] object.
 */
fun AddressDao.toEntity(id: UUIDAsString) = Address.insertOrUpdateWithId(id) {

    it.street = street
    it.plz = plz
    it.city = city
    it.country = country
}
