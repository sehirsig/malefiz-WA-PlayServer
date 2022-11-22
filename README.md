# HTWG Constance - AIN 6 - Web Applications
# Scala Project Play Server - Malefiz Game
## Game Project For The Lecture WA

[![Scala CI](https://github.com/sehirsig/malefiz-WA-PlayServer/actions/workflows/scala.yml/badge.svg?branch=development&kill_cache=1)](https://github.com/sehirsig/malefiz-WA-Play/actions/workflows/scala.yml)

![gamepicture](https://user-images.githubusercontent.com/81407658/114448533-f96ce480-9bd3-11eb-93a7-74dc0941f6c1.jpg)


# Game Rules
Malefiz is a board game for 2 to 4 players. Each player has 5 figures to play with. Every figure starts in their base, at the bottom of the board. The beginning player rolls the dice. The thrown number has to be pulled completly. While walking with the figure, change of direction is not allowed. If a player lands on an enemys figure, the enemy has to put his figure back to his base. Figures are allowed to jump over other figures, but not over barricades. If a player lands on the barricade (with the exact number), he has to set the barricade anywhere on the game board, all black fields are allowed, except the lowest row.

## Goal Of The Game
The player reaching the top of the gameboard first (with the exact number rolled with the dice) with one figure wins the game.

# How This Game Works

<details><summary>Open The Game And Add Players (2-4)!</summary>
<p>
    <img src="https://media.giphy.com/media/KmHC7K3nc9odODI7b0/giphy.gif" alt>
</p>
</details>
<details><summary>Start The Game!</summary>
<p>
    <img src="https://media.giphy.com/media/F46Pb3YBG130zKn3dj/giphy.gif" alt>
</p>
</details>
<details><summary>Roll The Dice!</summary>
<p>
    <img src="https://media.giphy.com/media/0v5SGvqnmAoQUe5NqG/giphy.gif" alt>
</p>
</details>
<details><summary>Choose The Gamefigure!</summary>
<p>
    <img src="https://media.giphy.com/media/jfQvxoAVKkUMKREL1j/giphy.gif" alt>
</p>
</details>
<details><summary>Move The Gamefigure!</summary>
<p>
    <img src="https://media.giphy.com/media/qQnZz74IFNAYqFzAkJ/giphy.gif" alt>
</p>
</details><details><summary>Kick A Gamefigure!</summary>
<p>
    <img src="https://media.giphy.com/media/QlGzFkpEK1fVqC1NOo/giphy.gif" alt>
</p>
</details><details><summary>Move A Blockade!</summary>
<p>
    <img src="https://media.giphy.com/media/i7HLTDgBWVDfqBTT8k/giphy.gif" alt>
</p>
</details>

## Informations
> When the player does a faulty move, the gamefigure gets reset to the starting point of its move (ex. walk into a barrier with one or more moves left). This is done with our Undo-Manager.

> If a player can't do a regular move, the player can press the 'skip' button to skip his move.

## Extra Features
<details><summary>Skip A Move!</summary>
<p>
    <img src="https://media.giphy.com/media/tZ8ydBQD5o76EbmosY/giphy.gif" alt>
</p>
 The player is allowed to skip his current move. It will be the next players turn.
 <p>
 TUI Command -> 'skip'
 </p>
</details>
<details><summary>Save The Game Progress!</summary>
<p>
    <img src="https://media.giphy.com/media/pgCaejbdDMn6PmDER2/giphy.gif" alt>
</p>
 The player is allowed to save the game, when he finished his current move and before the next player throws the dice. 
 <p>
 TUI Command -> 'save'
 </p>
</details>
<details><summary>Load The Game Progress!</summary>
<p>
    <img src="https://media.giphy.com/media/c5Df8CZsTUB4ToWnBu/giphy.gif" alt>
</p>
The player is allowed to load the savegame, before the game starts. You need to add enough players before loading!
<p>
TUI Command -> 'load'
</p>
</details>
<details><summary>Undo The Last Move!</summary>
<p>
    <img src="https://media.giphy.com/media/sxnVgmTyBsZ0PzvkiC/giphy.gif" alt>
</p>
The player is allowed to undo his last movement! (And also for information: The whole move gets undo'd if the player moves into a not allowed direction)
<p>
TUI Command -> 'undo'
</p>
</details>
<details><summary>Redo The Last Move!</summary>
<p>
    <img src="https://media.giphy.com/media/sFvqvJ8FJONqNOMgeV/giphy.gif" alt>
</p>
The player is allowed to load the savegame, before the game starts. You need to add enough players before loading!
<p>
TUI Command -> 'redo'
</p>
</details>
<details><summary>Reset The Game!</summary>
<p>
    <img src="https://media.giphy.com/media/7GUrWb1vFC4ztyK0t8/giphy.gif" alt>
</p>
The player is allowed to reset the game at any given time via GUI! This resets the whole game and deletes all players.
<p>
</p>
</details>

## TUI Commands Information
> After the player has rolled the dice, a number from 1 to 5 has to be entered, to choose the gamefigure.

# Procedure Of Making This Game




# Used Design Patterns
* Builder-Pattern *[PlayerBuilder](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/model/playerComponent/PlayerBuilder.scala)*
* State-Pattern [*TUI State*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/aview/TUIState.scala)  [*Player State*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/controller/controllerComponent/PlayerState.scala)
* Try-Monade [*replaceCell()*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/model/gameboardComponent/gameboardBaseImpl/Gameboard.scala#L132)
* Option-Monade [*Dice*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/model/gameboardComponent/gameboardBaseImpl/Dice.scala)
* Strategy-Pattern [*Block-Strategy*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/util/BlockStrategy.scala)
* Reactor-Events [*Event/Listener/Reactor*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/controller/controllerComponent/ControllerInterface.scala#L129)
* Command-Pattern [*Command*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/util/Command.scala)
* Undo-Manager [*UndoManager*](https://github.com/franzgajewski/malefiz/blob/master/src/main/scala/de/htwg/se/malefiz/util/UndoManager.scala)


# Presentation Link
[Google Presentation](https://docs.google.com/)

*Project Malefiz written by [@sehirsig](https://github.com/sehirsig/) & [@jojoGraff](https://github.com/jojoGraff/)*
