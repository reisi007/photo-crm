package pictures.reisinger.crm


import assertk.Assert
import assertk.assertAll
import assertk.assertThat
import assertk.assertions.prop
import assertk.assertions.support.expected
import assertk.assertions.support.fail
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.*
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.testApplication
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import java.sql.DriverManager
import java.util.*
import kotlin.reflect.KProperty1

/**
 * Executes a CRM test using the provided test DSL.
 *
 * @param developmentMode Determines whether the test should run in development mode. Default is true.
 * @param test The test to execute. The test block should be a suspendable lambda that takes an instance of [HttpClient] as a receiver.
 * @receiver The [HttpClient] instance used to execute the test.
 */
fun crmTest(developmentMode: Boolean = true, test: @CrmTestDsl suspend HttpClient.() -> Unit) = testApplication {
    val jdbcUrl = "jdbc:sqlite:file:${UUID.randomUUID()}?mode=memory&cache=shared"
    environment { this.developmentMode = developmentMode }
    application {
        Database.connect(jdbcUrl, driver = "org.sqlite.JDBC")
        internalModule()
    }
    val client = createClient {
        install(ContentNegotiation) {
            json(true)
        }
    }

    /* SQlite deletes the in memory db when nothing is connected to it
    *
    * This code does two things (which are not needed for a file based database)
    * - Have a connection open as long as the actual test runs so that during the test the in memory DB does not get destroyed
    * - Close (and delete the in memory DB) after the test
    *
    * So do not delete this or tables will be missing (tables can also be missing if it is not added in pictures.reisinger.crm.db.initializeDatabase
    */
    DriverManager.getConnection(jdbcUrl).use {
        client.test()
    }
}


private fun ContentNegotiation.Config.json(prettyPrint: Boolean) {
    json(Json {
        this.prettyPrint = prettyPrint
    })
}

@CrmTestDsl
suspend inline fun <reified T> HttpClient.postJson(url: String, data: T): HttpReturn = post(url) {
    accept(ContentType.Application.Json)
    contentType(ContentType.Application.Json)
    setBody(data)
}.toHttpReturn<T>()

@CrmTestDsl
suspend inline fun <reified T> HttpClient.putJson(url: String, data: T): HttpReturn = put(url) {
    accept(ContentType.Application.Json)
    contentType(ContentType.Application.Json)
    setBody(data)
}.toHttpReturn<T>()

@CrmTestDsl
suspend inline fun <reified T> HttpClient.deleteJson(url: String, data: T): HttpReturn = delete(url) {
    accept(ContentType.Application.Json)
    contentType(ContentType.Application.Json)
    setBody(data)
}.toHttpReturn<T>()

@CrmTestDsl
suspend inline fun <reified T> HttpClient.getJson(url: String): HttpReturn = get(url) {
    accept(ContentType.Application.Json)
}.toHttpReturn<T>()

@CrmTestDsl
suspend inline fun <reified T> HttpResponse.toHttpReturn(): HttpReturn = when (status.value) {
    204, 205, 304 -> NoContent(status, headers)
    in 200 until 300 -> SuccessContent(status, headers, body<T>())
    else -> ErrorContent(body(), headers)
}


fun HttpReturn.isNoContent(block: Assert<NoContent>.() -> Unit = {}) = assertThis { block(isInstanceOf<NoContent>()) }

inline fun <reified T : Any> Assert<Any>.isInstanceOf(): Assert<T> {
    return transform(name) { actual ->
        actual as? T ?: expected("Instaceof check not successful", T::class, actual)
    }
}

fun HttpReturn.isErrorContent(block: Assert<ErrorContent>.() -> Unit) =
    assertThis { block(isInstanceOf<ErrorContent>()) }

fun <T> HttpReturn.isSuccessContent(block: Assert<SuccessContent<T>>.() -> Unit) =
    assertThis { block(isInstanceOf<SuccessContent<T>>()) }

fun <T> Assert<SuccessContent<T>>.getData() = prop(SuccessContent<T>::data)

fun <T> T.assertThis(block: Assert<T>.() -> Unit) = assertAll {
    assertThat(this).let(block)
}

fun <T> Assert<Pair<T, T>>.areEqual() = given { (expected, actual) ->
    if (actual == expected) return
    fail(expected, actual)
}

fun <T : Comparable<T>> Assert<Pair<T, T>>.areEqualComparingTo() = given { (expected, actual) ->
    if (actual.compareTo(expected) == 0) return
    fail(expected, actual)
}

fun <I, O> Assert<Pair<I, I>>.propPair(callable: KProperty1<I, O>): Assert<Pair<O, O>> =
    prop(callable.name) { (first, second) ->
        callable.get(first) to callable.get(second)
    }


@DslMarker
@Target(AnnotationTarget.CLASS, AnnotationTarget.TYPEALIAS, AnnotationTarget.TYPE, AnnotationTarget.FUNCTION)
annotation class CrmTestDsl

@CrmTestDsl
sealed interface HttpReturn

@CrmTestDsl
data class NoContent(val statusCode: HttpStatusCode, val headers: Headers) : HttpReturn

@CrmTestDsl
data class ErrorContent(val apiError: Error, val headers: Headers) : HttpReturn


@CrmTestDsl
data class SuccessContent<T>(val statusCode: HttpStatusCode, val headers: Headers, val data: T) : HttpReturn
