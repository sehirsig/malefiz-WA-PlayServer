package controllers

import javax.inject._
import play.api.mvc._

class ErrorController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def notFound: Action[AnyContent] = Action {
    NotFound(views.html.error.notFound())
  }

  def badRequest: Action[AnyContent] = Action {
    BadRequest(views.html.error.badRequest())
  }

  def internalServerError: Action[AnyContent] = Action {
    BadRequest(views.html.error.internalServerError())
  }

}
