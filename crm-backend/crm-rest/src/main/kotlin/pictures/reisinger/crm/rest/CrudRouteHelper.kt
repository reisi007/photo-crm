package pictures.reisinger.crm.rest

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.*
import io.ktor.server.util.getOrFail
import io.ktor.util.KtorDsl
import io.ktor.util.pipeline.PipelineContext
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.*

interface Id<T> {
    var id: T
}

@KtorDsl
inline fun <reified Entity : UUIDEntity, reified Table : UUIDEntityClass<Entity>, reified Dao : Id<UUID?>, reified UpdateDao : Id<UUID?>> Route.crudRoutes(
    subpath: String,
    table: Table,
    crossinline toDao: Entity.() -> Dao,
    crossinline toEntity: UpdateDao.() -> Entity,
    crossinline moreRoutes: Route.() -> Unit = {}
) = route(subpath) {
    get {
        call.respondOr404<List<Dao>>(table.all().map { it.toDao() })
    }
    post { persistMultiple(toEntity) }
    put { persistMultiple(toEntity) }
    delete {
        val body = call.receive<Array<UpdateDao>>()
        transaction { body.forEach { it.toEntity().delete() } }
    }

    get("{id}") {
        val id: UUID = call.getIdFromParameters()
        call.respondOr404<Dao>(transaction {
            table.findById(id)?.toDao()
        })
    }
    put("{id}") { persistOne(toEntity) }
    post("{id}") { persistOne(toEntity) }

    delete("{id}") {
        val id = call.getIdFromParameters()
        val body = call.receive<UpdateDao>().apply { this.id = id }
        transaction { body.toEntity().delete() }
        call.respond(HttpStatusCode.NoContent)
    }

    moreRoutes()
}

suspend inline fun <reified Entity : UUIDEntity, reified UpdateDao : Id<UUID?>> PipelineContext<Unit, ApplicationCall>.persistOne(
    crossinline toEntity: UpdateDao.() -> Entity
) {
    val id = call.getIdFromParameters()
    val body = call.receive<UpdateDao>().apply { this.id = id }
    transaction { body.toEntity() }
    call.respond(HttpStatusCode.NoContent)
}

suspend inline fun <reified Entity : UUIDEntity, reified UpdateDao : Id<UUID?>> PipelineContext<Unit, ApplicationCall>.persistMultiple(
    crossinline toEntity: UpdateDao.() -> Entity
) {
    val body = call.receive<Array<UpdateDao>>()
    transaction {
        body.map { it.toEntity() }
    }
    call.respond(HttpStatusCode.NoContent)
}

fun ApplicationCall.getIdFromParameters() = parameters.getOrFail<UUID>("id")

suspend inline fun <reified T> ApplicationCall.respondOr404(message: T?) {
    if (message == null)
        response.status(HttpStatusCode.NotFound)
    else respond(message)
}
