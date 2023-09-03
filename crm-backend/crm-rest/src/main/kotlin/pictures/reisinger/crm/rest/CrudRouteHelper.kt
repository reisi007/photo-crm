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
import org.jetbrains.exposed.dao.Entity
import org.jetbrains.exposed.dao.EntityClass
import org.jetbrains.exposed.sql.transactions.transaction

interface Id<T> {
    var id: T
}

@KtorDsl
inline fun <reified T, reified ENTITY : Entity<T>, reified TABLE : EntityClass<T, ENTITY>, reified DAO : Id<T?>, reified UPDATEDAO : Id<T?>> Route.crudRoutes(
    subpath: String,
    table: TABLE,
    crossinline toDao: ENTITY.() -> DAO,
    crossinline toEntity: UPDATEDAO.(ApplicationCall) -> ENTITY,
    crossinline findAll: TABLE .(ApplicationCall) -> Iterable<ENTITY> = { all() },
    crossinline ensureUpdateDaoFitsPath: UPDATEDAO.(ApplicationCall) -> Unit = {},
    crossinline moreRoutes: Route.() -> Unit = {}
): Route {

    return route(subpath) {
        get {
            call.respondOr404(transaction {
                table.findAll(call).map { it.toDao() }
            })
        }
        post { persistMultiple<T, ENTITY, UPDATEDAO>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }
        put { persistMultiple<T, ENTITY, UPDATEDAO>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }
        delete {
            val body = call.receive<Array<UPDATEDAO>>()
            transaction { body.forEach { it.toEntity(call).delete() } }
        }

        get("{id}") {
            val id: T = call.getIdFromParameters()
            call.respondOr404(transaction {
                table.findById(id)?.toDao()
            })
        }
        put("{id}") { persistOne<T, ENTITY, UPDATEDAO>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }
        post("{id}") { persistOne<T, ENTITY, UPDATEDAO>({ toEntity(call) }, { ensureUpdateDaoFitsPath(call) }) }

        delete("{id}") {
            val id: T = call.getIdFromParameters()
            val body = call.receive<UPDATEDAO>()
            body.id = id
            body.ensureUpdateDaoFitsPath(call)
            transaction { body.toEntity(call).delete() }
            call.respond(HttpStatusCode.NoContent)
        }

        moreRoutes()
    }
}

suspend inline fun <reified T, reified ENTITY : Entity<T>, reified UpdateDao : Id<T?>> PipelineContext<Unit, ApplicationCall>.persistOne(
    crossinline toEntity: UpdateDao.() -> ENTITY,
    crossinline ensureUpdateDaoFitsPath: UpdateDao.() -> Unit
) {
    val id: T = call.getIdFromParameters()
    val body = call.receive<UpdateDao>()
    body.id = id
    body.ensureUpdateDaoFitsPath()
    transaction { body.toEntity() }
    call.respond(HttpStatusCode.NoContent)
}

suspend inline fun <reified T, reified ENTITY : Entity<T>, reified UpdateDao : Id<T?>> PipelineContext<Unit, ApplicationCall>.persistMultiple(
    crossinline toEntity: UpdateDao.() -> ENTITY,
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

inline fun <reified T : Any> ApplicationCall.getIdFromParameters(param: String = "id"): T =
    parameters.getOrFail<T>(param)

suspend inline fun <reified T> ApplicationCall.respondOr404(message: T?) {
    if (message == null)
        response.status(HttpStatusCode.NotFound)
    else respond(message)
}
