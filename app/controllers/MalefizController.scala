package controllers

import javax.inject._
import play.api.mvc._
import de.htwg.se.malefiz.Malefiz
import de.htwg.se.malefiz.controller.controllerComponent.GameStatus
import de.htwg.se.malefiz.controller.controllerComponent.GameStatus._
import models._


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

    val gamewinner = gameController.gameWon._2

    gameController.gameStatus match {
      case GAMEWINNER => Ok(views.html.malefiz.winner(this, gamewinner))
      case _ => Ok(views.html.malefiz.gameboard(this, malefizAsText, gameMessage, diceRolled, currentplayer, atLeast2Players, players))
    }
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

  def addplayer(name: String) = Action {
    gameController.addPlayer()
    gameController.addPlayerName(name)
    addText
  }

  def start = Action {
    gameController.startGame()
    addText
  }

  def rollDice = Action {
    gameController.rollDice()
    addText
  }

  def selectFigure(figurenum: Int) = Action {
    if (figurenum < 1 || figurenum > 5) {
      badRequest("You need to choose a number between 1 - 5")
    } else {
      gameController.selectFigure(figurenum)
      addText
    }
  }

  def move(input: String) = Action {
    gameController.move(input, gameController.selectedFigNum)
    addText
  }

  def skip = Action {
    gameController.move("skip", gameController.selectedFigNum)
    addText
  }

  def saveGame = Action {
    gameController.save
    addText
  }

  def loadGame = Action {
    gameController.load
    addText
  }

  def undoGame = Action {
    gameController.undo
    addText
  }

  def redoGame = Action {
    gameController.redo
    addText
  }

  def resetGame = Action {
    gameController.resetGame()
    addText
  }

  val gameData = new gameData()

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

  def allRoutes = {
    """
    GET  /
    GET  / about
    GET  / controls
    GET  / start
    GET  / addplayer /: playername
    GET  / selectfig /: figurenum
    GET  / move /: input { w, a , s, d }
    GET  / skip
    GET  / rolldice
    GET  / save
    GET  / load
    GET  / undo
    GET  / redo
    GET  / reset
    GET  / errors / notfound
    """
  }
}