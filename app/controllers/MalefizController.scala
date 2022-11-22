package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.malefiz.Malefiz
import de.htwg.se.malefiz.controller.controllerComponent.GameStatus
import de.htwg.se.malefiz.controller.controllerComponent.GameStatus._
import models._
import play.api.libs.json.{JsObject, JsValue, Json, Writes}


@Singleton
class MalefizController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {
  val gameController = Malefiz.controller

  def malefizAsText = gameController.boardToString()

  def addText = {
    val gameMessage = GameStatus.gameMessage(gameController.gameStatus)
    val atLeast2Players = "You need to add at least 2 Players."
    val players = "Current Players: " + gameController.game.players.mkString(" ")
    val currentplayer = "Turn of Player: " + gameController.playerStatus.getCurrentPlayer.toString
    val diceRolled = "You rolled a " + gameController.savedGame.lastFullDice + "." + " Moves left: " + gameController.moveCounter

    Ok(views.html.malefiz.gameboard(this, malefizAsText, gameMessage, diceRolled, currentplayer, atLeast2Players, players))
  }

  def badRequest(errorMessage: String) = BadRequest(errorMessage + "\nPlease return to the last site")

  def about = Action {
    Ok(views.html.index())
  }

  def debugWinTest = Action {
    gameController.addPlayerDEBUGWINTEST("Herbert")
    gameController.addPlayerDEBUGWINTEST("Gustav")
    gameController.startGame()
    gameController.debugDice()
    gameController.selectFigure(1)
    addText
  }

  def debugRoll = Action {
    gameController.debugDice()
    addText
  }

  def home = Action {
    addText
  }

  def addplayer(name: String) = {
    gameController.addPlayer()
    gameController.addPlayerName(name)
  }

  def start = {
    gameController.startGame()
  }

  def rollDice = {
    gameController.rollDice()
  }

  def selectFigure(figurenum: Int): String = {
    if (figurenum < 1 || figurenum > 5) {
      "Error: You need to choose a number between 1 - 5"
    } else {
      gameController.selectFigure(figurenum)
      "Ok"
    }
  }

  def move(input: String) = {
    gameController.move(input, gameController.selectedFigNum)
  }

  def skip = {
    gameController.move("skip", gameController.selectedFigNum)
  }

  def saveGame = {
    gameController.save
  }

  def loadGame = {
    gameController.load
  }

  def undoGame = {
    gameController.undo
  }

  def redoGame = {
    gameController.redo
  }

  def resetGame = {
    gameController.resetGame()
  }

  def gameMessage() = GameStatus.gameMessage(gameController.gameStatus)

  def atLeast2Players() = "You need to add at least 2 Players."

  def players() = "Current Players: " + gameController.game.players.mkString(" ")

  def currentplayer() = "Turn of Player: " + gameController.playerStatus.getCurrentPlayer.toString

  def diceRolled() = "You rolled a " + gameController.savedGame.lastFullDice + "." + " Moves left: " + gameController.moveCounter

  def gamewinner() = gameController.gameWon._2

  case class Strings()
  implicit val stringsWrites: Writes[Strings] = new Writes[Strings] {
    def writes(strings:Strings): JsObject = Json.obj(
      "gameMessage" -> gameMessage(),
      "atLeast2Players" -> atLeast2Players(),
      "players" -> players(),
      "currentplayer" -> currentplayer(),
      "diceRolled" -> diceRolled(),
      "gamewinner" -> gamewinner()
    )
  }

  case class Gamefield()
  implicit val gamefieldWrites: Writes[Gamefield] = new Writes[Gamefield] {
    def writes(gamefield: Gamefield): JsValue = Json.toJson(
      for {
        row <- 0 until gameController.gameboard.getStandardXYsize._1
        col <- 0 until gameController.gameboard.getStandardXYsize._2
      } yield {
        Json.obj(
          "row" -> row,
          "col" -> col,
          "cell" -> Json.toJson(gameController.gameboard.cellString(row, col))
        )
      }
    )
  }

  def status = Action {
    Ok(Json.obj(
      "rows" -> Gamefield(),
      "row_size" -> gameController.gameboard.getStandardXYsize._1,
      "col_size" -> gameController.gameboard.getStandardXYsize._2,
      "gameStatusID" -> getStatusID(),
      "string" -> Strings())
    )
  }

  def getStatusID(): Int = {
    return gameController.gameStatus match {
      case WELCOME => 0
      case LOADED => 1
      case SAVED => 2
      case GAMEWINNER => 3
      case CHOOSEFIG => 4
      case IDLE => 5
      case READY1 => 6
      case READY2 => 7
      case PLAYER0 => 8
      case PLAYER1 => 9
      case PLAYER2 => 10
      case PLAYER3 => 11
      case PLAYER4 => 12
      case PLAYING => 13
      case MOVING => 14
      case ENTERNAME => 15
      case _ => -1
    }
  }

  def processCommand(cmd: String, data: String): String = {
    if (cmd.equals("\"start\"")) {
      start
    } else if (cmd.equals("\"rollDice\"")) {
      rollDice
    } else if (cmd.equals("\"selectFig\"")) {
      val result = selectFigure(data.replace("\"", "").toInt)
      return result
    } else if (cmd.equals("\"figMove\"")) {
      move(data.replace("\"", ""))
    } else if (cmd.equals("\"skip\"")) {
      skip
    } else if (cmd.equals("\"addPlayer\"")) {
      addplayer(data.replace("\"", ""))
    } else if (cmd.equals("\"reset\"")) {
      resetGame
    } else if (cmd.equals("\"save\"")) {
      saveGame
    } else if (cmd.equals("\"load\"")) {
      loadGame
    } else if (cmd.equals("\"undo\"")) {
      undoGame
    } else if (cmd.equals("\"redo\"")) {
      redoGame
    }
    "Ok"
  }

  def processRequest = Action {
    implicit request => {
      val req = request.body.asJson
      val result = processCommand(req.get("cmd").toString(), req.get("data").toString())
      if (result.contains("Error")) {
        BadRequest(result)
      } else {
        Ok(Json.obj(
          "rows" -> Gamefield(),
          "row_size" -> gameController.gameboard.getStandardXYsize._1,
          "col_size" -> gameController.gameboard.getStandardXYsize._2,
          "gameStatusID" -> getStatusID(),
          "string" -> Strings())
        )
      }
    }
  }

  def allRoutes = {
    """
    GET  /
    GET  / about
    POST / command
    GET  / status
    GET  / errors / notfound
    """
  }
}