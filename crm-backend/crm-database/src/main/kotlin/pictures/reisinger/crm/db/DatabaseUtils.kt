package pictures.reisinger.crm.db

import org.jetbrains.exposed.dao.Entity
import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.SizedIterable
import org.jetbrains.exposed.sql.SqlExpressionBuilder
import org.jetbrains.exposed.sql.transactions.transaction
import pictures.reisinger.crm.db.commons.AddressTable
import pictures.reisinger.crm.db.company.CompanyTable
import pictures.reisinger.crm.db.customer.CustomerTable
import pictures.reisinger.crm.db.order.OrderItemTable
import pictures.reisinger.crm.db.order.OrderTable

/**
 * Initializes the database by connecting to the SQLite database and creating missing tables and columns.
 */
fun initializeDatabase() {
    transaction {
        SchemaUtils.createMissingTablesAndColumns(
            AddressTable,
            CompanyTable,
            CustomerTable,
            OrderItemTable,
            OrderTable
        )
    }
}

/**
 * Inserts or updates an entity in the database.
 *
 * @param nullableId The nullable ID of the entity to insert or update.
 * @param selectExpression A lambda function that takes an instance of SqlExpressionBuilder and the ID of the entity, and returns a query expression to select the entity from the database.
 * @param fillData A lambda function that takes an instance of the entity and fills its data.
 * @return The inserted or updated entity.
 */
fun <ID : Comparable<ID>, T : Entity<ID>> EntityClass<ID, T>.insertOrUpdate(
    nullableId: ID?,
    selectExpression: SqlExpressionBuilder.(id: ID) -> Op<Boolean>,
    fillData: (T) -> Unit
): T {
    if (nullableId != null) {
        find { selectExpression(nullableId) }.firstOrNull()?.also(fillData)?.let { return it }
    }
    return if (nullableId == null) new(fillData) else new(nullableId, fillData)
}

fun <ID : Comparable<ID>, T : Entity<ID>> EntityClass<ID, T>.insertOrUpdateWithId(
    id: ID,
    fillData: (T) -> Unit
): T = findById(id)?.also(fillData) ?: new(id, fillData)
