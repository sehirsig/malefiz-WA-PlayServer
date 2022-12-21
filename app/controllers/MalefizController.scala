package controllers

import akka.actor.{Actor, ActorRef, ActorSystem, Props}
import akka.stream.Materializer

import javax.inject._
import play.api.mvc._
import de.htwg.se.malefiz.Malefiz
import de.htwg.se.malefiz.controller.controllerComponent._
import de.htwg.se.malefiz.controller.controllerComponent.GameStatus._
import play.api.libs.json.{JsObject, JsValue, Json, Writes}
import play.api.libs.streams.ActorFlow

import scala.swing.Reactor


@Singleton
class MalefizController @Inject()(cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer) extends AbstractController(cc) {
  val gameController = Malefiz.controller

  def badRequest(errorMessage: String) = BadRequest(errorMessage + "\nPlease return to the last site")

  def about = Action {
    Ok(views.html.index())
  }

  def home = Action {
    Ok(views.html.malefiz.gameboard())
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
    secretArray.empty
  }

  def gameMessage() = GameStatus.gameMessage(gameController.gameStatus)

  def atLeast2Players() = "You need to add at least 2 Players."

  def players() = "Current Players: " + gameController.game.players.mkString(" ")

  def currentplayer() = "Turn of Player: " + gameController.playerStatus.getCurrentPlayer.toString

  def diceRolled() = "You rolled a " + gameController.savedGame.lastFullDice + "." + " Moves left: " + gameController.moveCounter

  def gamewinner() = gameController.gameWon._2

  def currentPlayerNum() = {
    val num = gameController.playerStatus.getCurrentPlayer
    if (num < 1 || num > 4) {
      0
    } else {
      num
    }
  }

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
      "string" -> Strings(),
      "turn_id" -> currentPlayerNum(),
      "player_count" -> gameController.game.players.size,
      "secretId" -> "") //Num of current player 1 - 4
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

  def processCommand(cmd: String, data: String, secretId: String): String = {
    if (cmd.equals("\"addPlayer\"")) {
      addplayer(data.replace("\"", ""))
      secretArray(gameController.game.players.size - 1) = scala.util.Random.nextInt(9999999).toString
    }
    if ("\"" + secretArray(gameController.playerStatus.getCurrentPlayer - 1) + "\"" == secretId) {
      cmd match {
        case "\"start\"" => start
        case "\"rollDice\"" => rollDice
        case "\"selectFig\"" => return selectFigure(data.toInt)
        case "\"figMove\"" => move(data)
        case "\"skip\"" => skip
        case "\"reset\"" => resetGame
        case "\"save\"" => saveGame
        case "\"load\"" => loadGame
        case "\"undo\"" => undoGame
        case "\"redo\"" => redoGame
        case _ =>
      }
    } else if (secretArray.contains(secretId.replace("\"", ""))) {
      if (cmd.equals("\"reset\"")) {
        resetGame
      }
    } else if (cmd.equals("\"reset\"")) { // Nur drinnen weil beforeunload nicht funktioniert
      resetGame
    }
    "Ok"
  }

  var secretArray = Array("", "", "", "")

  def processRequest = Action {
    implicit request => {
      val req = request.body.asJson
      val result = processCommand(req.get("cmd").toString(), req.get("data").toString(), req.get("secretId").toString())
      // Secret ID Erstellen und zurückschicken
      if (result.contains("Error")) {
        BadRequest(result)
      } else {
        Ok(Json.obj(
          "rows" -> Gamefield(),
          "row_size" -> gameController.gameboard.getStandardXYsize._1,
          "col_size" -> gameController.gameboard.getStandardXYsize._2,
          "gameStatusID" -> getStatusID(),
          "string" -> Strings(),
          "turn_id" -> currentPlayerNum(),
          "player_count" -> gameController.game.players.size,
          "secretId" -> {if (req.get("cmd").toString().equals("\"addPlayer\"")) {secretArray(gameController.game.players.size - 1)} else {""}})
        )
      }
    }
  }

  def controllerToJson(reset:Int = 0) = {
    (Json.obj(
      "rows" -> Gamefield(),
      "row_size" -> gameController.gameboard.getStandardXYsize._1,
      "col_size" -> gameController.gameboard.getStandardXYsize._2,
      "gameStatusID" -> getStatusID(),
      "string" -> Strings(),
      "turn_id" -> currentPlayerNum(),
      "player_count" -> gameController.game.players.size,
      "reset" -> reset,
      "secretId" -> "")).toString
  }

  def controllerToJsonSID(reset: Int = 0) = {
    (Json.obj(
      "rows" -> Gamefield(),
      "row_size" -> gameController.gameboard.getStandardXYsize._1,
      "col_size" -> gameController.gameboard.getStandardXYsize._2,
      "gameStatusID" -> getStatusID(),
      "string" -> Strings(),
      "turn_id" -> currentPlayerNum(),
      "player_count" -> gameController.game.players.size,
      "reset" -> reset,
      "secretId" -> secretArray(gameController.game.players.size - 1))).toString
  }

  def socket = WebSocket.accept[String, String] { request =>
    ActorFlow.actorRef { out =>
      MalefizSocketActor.props(out)
    }
  }

  object MalefizSocketActor {
    def props(out: ActorRef) = {
      Props(new MalefizSocketActor(out))
    }
  }

  def wsCommand(cmd:String, data:String, secretId:String): String = {
    if (cmd.equals("addPlayer")) {
      addplayer(data)
      secretArray(gameController.game.players.size - 1) = scala.util.Random.nextInt(9999999).toString
    }
    if (secretArray(gameController.playerStatus.getCurrentPlayer - 1) == secretId) {
      cmd match {
        case "start" => start
        case "rollDice" => rollDice
        case "selectFig" => return selectFigure(data.toInt)
        case "figMove" => move(data)
        case "skip" => skip
        case "reset" => resetGame
        case "save" => saveGame
        case "load" => loadGame
        case "undo" => undoGame
        case "redo" => redoGame
        case _ =>
      }
    } else if (secretArray.contains(secretId)) {
      if (cmd.equals("reset")) {
        resetGame
      }
    } else if (cmd.equals("reset")) { // Nur drinnen weil beforeunload nicht funktioniert
      resetGame
    }
    "Ok"
  }

  class MalefizSocketActor(out: ActorRef) extends Actor with Reactor {
    listenTo(gameController)

    def receive = {
      case msg: String =>
        System.out.println("Received: " + msg)
        val split_msg = msg.split('|')
        if (split_msg.length == 3) {
          val cmd = split_msg(0)
          val data = split_msg(1)
          val secretId = split_msg(2)
          if (wsCommand(cmd, data, secretId).contains("Error")) {
            out ! controllerToJson()
          } else {
            if (cmd.equals("addPlayer")) {
              out ! controllerToJsonSID()
            } else {
              out ! controllerToJson()
            }
          }
        } else {
          out ! controllerToJson()
        }
    }

    reactions += {
      case event: RollDice => out ! controllerToJson()
      case event: Moving => out ! controllerToJson()
      case event: ChooseFig => out ! controllerToJson()
      //case event: SettingUp => out ! ("Update") //Überspringen, da bei Add player sofort auf Start Up wechselt
      case event: StartUp => out ! controllerToJson()
      case event: StartGame => out ! controllerToJson()
      case event: WonGame => out ! controllerToJson()
      case event: GameReset => out ! controllerToJson(1)
      case event: GameSaved => out ! controllerToJson()
      case event: GameLoaded => out ! controllerToJson()
    }
  }
}