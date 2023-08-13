package pictures.reisinger.crm

import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.application.log
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.http.content.staticResources
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.contentnegotiation.ContentNegotiationConfig
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.uri
import io.ktor.server.response.respond
import io.ktor.server.routing.Routing
import io.ktor.server.routing.route
import io.ktor.server.routing.routing
import io.ktor.util.KtorDsl
import io.ktor.util.logging.KtorSimpleLogger
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.dao.exceptions.EntityNotFoundException
import org.jetbrains.exposed.sql.Database
import pictures.reisinger.crm.db.initializeDatabase
import pictures.reisinger.crm.rest.HttpStatusCodeException
import pictures.reisinger.crm.rest.dao.trimToNull
import pictures.reisinger.crm.rest.registerCompanyRoutes
import pictures.reisinger.crm.rest.registerCustomerRoutes
import pictures.reisinger.crm.rest.registerOrderRoutes

internal val DEV_LOGGER = KtorSimpleLogger("DevOutput")

fun Application.module() {
    Database.connect(
        "jdbc:sqlite:file:data/${if (environment.developmentMode) "dev" else "prod"}.sqlite",
        driver = "org.sqlite.JDBC"
    )
    internalModule()
}

internal fun Application.internalModule() {
    initializeMiddleware()
    initializeDatabase()
    routing {
        route("/rest") {
            registerCompanyRoutes()
            registerCustomerRoutes()
            registerOrderRoutes()
        }
        angular()
    }

    DEV_LOGGER.debug("Startup finished")
}


/**
 * Initializes the middleware for the application.
 *
 * This method installs the `ContentNegotiation` and `CallLogging` middleware for the application.
 * The `ContentNegotiation` middleware is used to configure content negotiation for the application,
 * with JSON format and pretty printing enabled. The `CallLogging` middleware is used to log
 * incoming requests and outgoing responses at the `INFO` level.
 *
 * @receiver The application instance.
 */
private fun Application.initializeMiddleware() {
    val isDevMode = environment.developmentMode
    if (isDevMode) DEV_LOGGER.debug("Dev mode activated")
    install(ContentNegotiation) {
        json(isDevMode)
    }
    install(StatusPages) {

        status(HttpStatusCode.NotFound) { call, status ->
            call.respond(status, Error(status))
        }

        exception<EntityNotFoundException> { call, _ ->
            call.respond(HttpStatusCode.NotFound, Error(HttpStatusCode.NotFound))
        }

        exception<Throwable> { call, cause ->
            call.application.log.error(call.request.uri, cause)

            val statusCodeOrDefault =
                (cause as? HttpStatusCodeException)?.statusCode ?: HttpStatusCode.InternalServerError
            val message = cause.message
            val errorMessage = if (isDevMode && message != null) message else "An internal server error occurred"

            call.respond(statusCodeOrDefault, Error(statusCodeOrDefault, errorMessage.trimToNull()))
        }
    }
}

@Serializable
data class Error(val statusCode: Int, val statusDescription: String, val errorMessage: String? = null) {
    constructor(status: HttpStatusCode, errorMessage: String? = null) : this(
        status.value,
        status.description,
        errorMessage
    )

    override fun toString(): String {
        return buildString {
            append("Error(statusCode=")
            append(statusCode)
            statusDescription.trimToNull()?.let {
                append(",statusDescription=")
                append(it)
            }
            errorMessage?.trimToNull()?.let {
                append(",errorMessage=")
                append(it)
            }
            append(")")
        }
    }
}

/**
 * Configures the Angular routing for the application.
 *
 * This method sets up the routing for serving static resources for the frontend Angular application.

 *
 * @return Route
 */
@KtorDsl
fun Routing.angular() = staticResources("/", "frontend") {
    default("index.html")
}

/**
 * Configures the Content Negotiation feature to use JSON as the default format.
 */
@OptIn(ExperimentalSerializationApi::class)
private fun ContentNegotiationConfig.json(prettyPrint: Boolean) {
    json(Json {
        this.prettyPrint = prettyPrint
        explicitNulls = false
        ignoreUnknownKeys = true
    })
}

fun main() {
    val applicationEngineEnvironment = applicationEngineEnvironment {
        connector {
            port = 8080
        }

        module {
            module()
        }
    }
    embeddedServer(Netty, applicationEngineEnvironment)
        .start(wait = true)
}

