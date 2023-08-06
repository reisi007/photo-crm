package pictures.reisinger.crm.rest;

import io.ktor.http.*

class HttpStatusCodeException : Exception {

    val statusCode: HttpStatusCode

    constructor(statusCode: HttpStatusCode) {
        this.statusCode = statusCode
    }

    constructor(statusCode: HttpStatusCode, message: String) : super(message) {
        this.statusCode = statusCode
    }

    constructor(statusCode: HttpStatusCode, message: String, cause: Throwable) : super(message, cause) {
        this.statusCode = statusCode
    }

    constructor(statusCode: HttpStatusCode, cause: Throwable) : super(cause) {
        this.statusCode = statusCode
    }
}
