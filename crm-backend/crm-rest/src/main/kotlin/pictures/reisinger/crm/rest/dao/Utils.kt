package pictures.reisinger.crm.rest.dao

import io.ks3.java.util.UuidSerializer
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.Entity
import pictures.reisinger.crm.rest.Id
import java.util.*

/**
 * Type alias for representing a UUID as a string.
 *
 * This typealias is used to annotate a property or parameter that expects a UUID as a string.
 * The UUID will be serialized and deserialized using the [UuidSerializer] class.
 *
 * @see UuidSerializer
 */
typealias UUIDAsString = @Serializable(UuidSerializer::class) UUID


/**
 * Trims the leading and trailing whitespace from a string and returns null if the resulting string is empty.
 *
 * @return The trimmed string, or null if the resulting string is empty.
 */
fun String.trimToNull() = trim().ifEmpty { null }


/**
 * Updates children entities based on the given collection of child DAOs.
 *
 * @param T the type of the entity
 * @param CHILD_DAO the type of the child DAO
 * @param CHILD_ID the type of the child entity identifier
 * @param CHILD the type of the child entity
 * @param allItems the collection of all children entities
 * @param mapChild the function to map a child DAO to its corresponding child entity
 */
fun <T, CHILD_DAO : Id<T>, CHILD_ID : Comparable<CHILD_ID>, CHILD : Entity<CHILD_ID>> Iterable<CHILD_DAO>.updateChildren(
    allItems: Iterable<CHILD>,
    mapChild: CHILD_DAO.() -> CHILD
) {
    val nextItems = mutableSetOf<CHILD_ID>()
    forEach {
        val item = mapChild(it)
        nextItems += item.id.value
    }

    allItems.asSequence()
        .filter { !nextItems.contains(it.id.value) }
        .forEach { it.delete() }
}
