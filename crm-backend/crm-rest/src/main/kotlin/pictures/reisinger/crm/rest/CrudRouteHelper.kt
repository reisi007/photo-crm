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
    crossinline toEntity: UpdateDao.(ApplicationCall) -> Entity,
    crossinline findAll: Table .(ApplicationCall) -> Iterable<Entity> = { all() },
    crossinline ensureUpdateDaoFitsPath: UpdateDao.(ApplicationCall) -> Unit = {},
    crossinline moreRoutes: Route.() -> Unit = {}
): Route {

    return route(subpath) {
        get {
            call.respondOr404(transaction {
                table.findAll(call).map { it.toDao() }
            })
        }
        post { persistMultiple<Entity, UpdateDao>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }
        put { persistMultiple<Entity, UpdateDao>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }
        delete {
            val body = call.receive<Array<UpdateDao>>()
            transaction { body.forEach { it.toEntity(call).delete() } }
        }

        get("{id}") {
            val id: UUID = call.getIdFromParameters()
            call.respondOr404(transaction {
                table.findById(id)?.toDao()
            })
        }
        put("{id}") { persistOne<Entity, UpdateDao>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }
        post("{id}") { persistOne<Entity, UpdateDao>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }

        delete("{id}") {
            val id = call.getIdFromParameters()
            val body = call.receive<UpdateDao>()
            body.id = id
            body.ensureUpdateDaoFitsPath(call)
            transaction { body.toEntity(call).delete() }
            call.respond(HttpStatusCode.NoContent)
        }

        moreRoutes()
    }
}

suspend inline fun <reified Entity : UUIDEntity, reified UpdateDao : Id<UUID?>> PipelineContext<Unit, ApplicationCall>.persistOne(
    crossinline toEntity: UpdateDao.() -> Entity,
    crossinline ensureUpdateDaoFitsPath: UpdateDao.() -> Unit
) {
    val id = call.getIdFromParameters()
    val body = call.receive<UpdateDao>()
    body.id = id
    body.ensureUpdateDaoFitsPath()
    transaction { body.toEntity() }
    call.respond(HttpStatusCode.NoContent)
}

suspend inline fun <reified Entity : UUIDEntity, reified UpdateDao : Id<UUID?>> PipelineContext<Unit, ApplicationCall>.persistMultiple(
    crossinline toEntity: UpdateDao.() -> Entity,
    crossinline ensureUpdateDaoFitsPath: UpdateDao.() -> Unit
) {
    val body = call.receive<Array<UpdateDao>>()
    transaction {
        body.forEach {
            it.also(ensureUpdateDaoFitsPath)
            it.toEntity()
        }
    }
    call.respond(HttpStatusCode.NoContent)
}

fun ApplicationCall.getIdFromParameters(param: String = "id") = parameters.getOrFail<UUID>(param)

suspend inline fun <reified T> ApplicationCall.respondOr404(message: T?) {
    if (message == null)
        response.status(HttpStatusCode.NotFound)
    else respond(message)
}
