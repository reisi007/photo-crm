package pictures.reisinger.crm.rest.dao

import kotlinx.serialization.Serializable
import pictures.reisinger.crm.db.commons.Address
import pictures.reisinger.crm.db.insertOrUpdateWithId
import pictures.reisinger.crm.rest.Id

/**
 * Represents a data class for storing address information.
 *
 * @property id The unique identifier for the address.
 * @property phone The phone number associated with the address.
 * @property email The email address associated with the address.
 * @property street The street or house number of the address.
 * @property plz The postal code associated with the address.
 * @property city The city or locality of the address.
 * @property country The country of the address.
 */
@Serializable
data class AddressDao(
    override var id: UUIDAsString?,
    var phone: String,
    var email: String,
    var street: String,
    var plz: String,
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
    phone,
    email,
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
    it.phone = phone
    it.email = email
    it.street = street
    it.plz = plz
    it.city = city
    it.country = country
}
