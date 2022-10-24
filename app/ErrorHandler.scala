import controllers.routes
import controllers.ErrorController
import play.api.http.HttpErrorHandler
import play.api.http.Status.{BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND}
import play.api.mvc._
import play.api.mvc.Results._

import scala.concurrent._
import javax.inject.Singleton

@Singleton
class ErrorHandler extends HttpErrorHandler {
  def onClientError(request: RequestHeader, statusCode: Int, message: String): Future[Result] = {
      if(statusCode == NOT_FOUND)
        Future.successful(Redirect(routes.ErrorController.notFound))
      else if(statusCode == BAD_REQUEST)
        Future.successful(Redirect(routes.ErrorController.badRequest))
      else
        Future.successful(Status(statusCode)("This " + statusCode + " Client Error has currently no custom handling"))
  }

  def onServerError(request: RequestHeader, exception: Throwable): Future[Result] = {
    Future.successful(Redirect(routes.ErrorController.internalServerError))
  }
}