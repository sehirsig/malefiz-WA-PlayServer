$(document).ready(function () {
        getData().then(() => {
            checkWin();
            updateInfoPanel();
            updateInputPanel();
            updateGameBoard();
            $("#testAudio").get(0).play();
            refreshOnClickEvents();
        })
    }
)

let stat_welcome = 0
let stat_loaded = 1
let stat_saved = 2
let stat_gamewinner = 3
let stat_choosefig = 4
let stat_idle = 5
let stat_ready1 = 6
let stat_ready2 = 7
let stat_playing = 13
let stat_moving = 14
let stat_entername = 15

let data = {}; //Game data from controller

function getData() {
    return $.ajax({
        method: "GET",
        url: "/status",
        dataType: "json",
        success: function (response) {
            data = response;
        }
    });
}

function updateGameBoard() {
    for (let i = 0; i < (data.row_size * data.col_size); ++i) {
        let row = data.rows[i].row
        let col = data.rows[i].col
        let fieldID = "field\\{" + row + "\\}_\\{" + col + "\\}" // \\ für escape von jquery
        let cellString = data.rows[i].cell

        if (cellString === "InvalidCell") {
            $('#' + fieldID).attr("src","/assets/images/game/invalid.png");
        } else if (cellString === "BlockedCell") {
            $('#' + fieldID).attr("src","/assets/images/game/blocked.png");
        } else if (cellString === "FreeCell") {
            $('#' + fieldID).attr("src","/assets/images/game/free.png");
        } else if (cellString === "SecureCell") {
            $('#' + fieldID).attr("src","/assets/images/game/free.png");
        } else if (cellString === "GoalCell") {
            $('#' + fieldID).attr("src","/assets/images/game/goal.png");
        } else if (cellString === "Start1Cell") {
            $('#' + fieldID).attr("src","/assets/images/game/start1.png");
        } else if (cellString === "Start2Cell") {
            $('#' + fieldID).attr("src","/assets/images/game/start2.png");
        } else if (cellString === "Start3Cell") {
            $('#' + fieldID).attr("src","/assets/images/game/start3.png");
        } else if (cellString === "Start4Cell") {
            $('#' + fieldID).attr("src","/assets/images/game/start4.png");
        } else if (cellString === "PlayerCell11") {
            $('#' + fieldID).attr("src","/assets/images/game/player11.png");
        } else if (cellString === "PlayerCell12") {
            $('#' + fieldID).attr("src","/assets/images/game/player12.png");
        } else if (cellString === "PlayerCell13") {
            $('#' + fieldID).attr("src","/assets/images/game/player13.png");
        } else if (cellString === "PlayerCell14") {
            $('#' + fieldID).attr("src","/assets/images/game/player14.png");
        } else if (cellString === "PlayerCell15") {
            $('#' + fieldID).attr("src","/assets/images/game/player15.png");
        } else if (cellString === "PlayerCell21") {
            $('#' + fieldID).attr("src","/assets/images/game/player21.png");
        } else if (cellString === "PlayerCell22") {
            $('#' + fieldID).attr("src","/assets/images/game/player22.png");
        } else if (cellString === "PlayerCell23") {
            $('#' + fieldID).attr("src","/assets/images/game/player23.png");
        } else if (cellString === "PlayerCell24") {
            $('#' + fieldID).attr("src","/assets/images/game/player24.png");
        } else if (cellString === "PlayerCell25") {
            $('#' + fieldID).attr("src","/assets/images/game/player25.png");
        } else if (cellString === "PlayerCell31") {
            $('#' + fieldID).attr("src","/assets/images/game/player31.png");
        } else if (cellString === "PlayerCell32") {
            $('#' + fieldID).attr("src","/assets/images/game/player32.png");
        } else if (cellString === "PlayerCell33") {
            $('#' + fieldID).attr("src","/assets/images/game/player33.png");
        } else if (cellString === "PlayerCell34") {
            $('#' + fieldID).attr("src","/assets/images/game/player34.png");
        } else if (cellString === "PlayerCell35") {
            $('#' + fieldID).attr("src","/assets/images/game/player35.png");
        } else if (cellString === "PlayerCell41") {
            $('#' + fieldID).attr("src","/assets/images/game/player41.png");
        } else if (cellString === "PlayerCell42") {
            $('#' + fieldID).attr("src","/assets/images/game/player42.png");
        } else if (cellString === "PlayerCell43") {
            $('#' + fieldID).attr("src","/assets/images/game/player43.png");
        } else if (cellString === "PlayerCell44") {
            $('#' + fieldID).attr("src","/assets/images/game/player44.png");
        } else if (cellString === "PlayerCell45") {
            $('#' + fieldID).attr("src","/assets/images/game/player45.png");
        }
    }
}

function updateInfoPanel() {
    let status = data.gameStatusID
    const parent = $('#information-panel').get(0);
    parent.innerHTML = ""
    if (status === stat_ready1) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.gameMessage}</p>`;
    }
    if (status === stat_ready2) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.gameMessage}</p>
                        <p class="text-center">${data.string.players}</p>`;
    }
    if (status === stat_playing) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.currentplayer}</p>
                    <p class="text-center">${data.string.diceRolled}</p>`;
    }
    if (status === stat_choosefig) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.diceRolled}</p>`;
    }
    if (status === stat_moving) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.currentplayer}</p>
                    <p class="text-center">${data.string.diceRolled}</p>`;
    }
    if (status === stat_welcome || status === stat_ready1 || status === stat_idle) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.atLeast2Players}</p>
                    <p class="text-center">${data.string.players}</p>`;
    }
    parent.innerHTML = parent.innerHTML + "</div>";
}

function updateInputPanel() {
    let status = data.gameStatusID

    const parent = $('#input-panel-group').get(0);
    parent.innerHTML = sResetButton +
        "<div class=\"row justify-content-center\">";
    if (status === stat_ready1) {
        parent.innerHTML = parent.innerHTML + sStartGame;
    }
    if (status === stat_ready2) {
        parent.innerHTML = parent.innerHTML + sStartGame + "</div>";
    }
    if (status === stat_playing) {
        parent.innerHTML = parent.innerHTML + sRollDice + "</div>";
    }
    if (status === stat_choosefig) {
        parent.innerHTML = parent.innerHTML + sChooseFig + "</div>";
    }
    if (status === stat_moving) {
        parent.innerHTML = parent.innerHTML + sMoving + "</div>";
    }
    if (status === stat_welcome || status === stat_ready1 || status === stat_idle) {
        parent.innerHTML = parent.innerHTML + sUserAdd + "</div>";
    }
}

let sResetButton = "<div class=\"row justify-content-center\">\n" +
    "                        <div class=\"row m-1\">\n" +
    "                            <div class=\"col text-center\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger input-critical-button\" id=\"resetButton\">\n" +
    "                                    Reset Game &#8634\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>"

let sStartGame = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col text-center\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-warning btn-block input-warning-button\" id=\"startButton\">\n" +
    "                                        Start Game</button>\n" +
    "                                </div>\n" +
    "                            </div>"

let sRollDice = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col\">\n" +
    "                                    <button type=\"button\" id=\"diceButton\" class=\"btn btn-success btn-block input-normal-button\" data-bs-toggle=\"modal\" data-bs-target=\"#rollModal\">\n" +
    "                                        Roll Dice</button>\n" +
    "                                    <div class=\"modal\" id=\"rollModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"infoModalLabel\" aria-hidden=\"true\" data-backdrop=\"false\">\n" +
    "                                        <div class=\"modal-dialog modal-dialog-centered\" role=\"document\" >\n" +
    "                                            <div class=\"modal-content\" id=\"diceModal\">\n" +
    "                                                <div class=\"modal-body\">\n" +
    "                                                    <div class='box'>\n" +
    "                                                        <div class=\"cube\">\n" +
    "                                                            <div class=\"side  front\">1</div>\n" +
    "                                                            <div class=\"side   back\">6</div>\n" +
    "                                                            <div class=\"side  right\">3</div>\n" +
    "                                                            <div class=\"side   left\">4</div>\n" +
    "                                                            <div class=\"side    top\">2</div>\n" +
    "                                                            <div class=\"side bottom\">5</div>\n" +
    "                                                        </div>\n" +
    "                                                    </div>\n" +
    "                                                    <audio id=\"diceAudio\" type=\"audio/mpeg\" src=\"/assets/audio/dice-shaking.mp3\">\n" +
    "                                                    </audio>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>"

let sChooseFig = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col btn-group justify-content-center\" role=\"group\" aria-label=\"First group\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"selectFig1Button\">\n" +
    "                                        1</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"selectFig2Button\">\n" +
    "                                        2</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"selectFig3Button\">\n" +
    "                                        3</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"selectFig4Button\">\n" +
    "                                        4</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"selectFig5Button\">\n" +
    "                                        5</button>\n" +
    "                                </div>\n" +
    "                            </div>"

let sMoving = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"figMoveUpButton\">\n" +
    "                                        &#9650</button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col btn-group justify-content-center\" role=\"group\" aria-label=\"First group\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"figMoveLeftButton\">\n" +
    "                                        &#9668</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"figMoveDownButton\">\n" +
    "                                        &#9660</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" id=\"figMoveRightButton\">\n" +
    "                                        &#9658</button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-warning input-warning-button\" id=\"skipMoveButton\">\n" +
    "                                        Skip</button>\n" +
    "                                </div>\n" +
    "                            </div>"

let sUserAdd = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col text-center\">\n" +
    "                                    <input type=\"text\" class=\"form-control text-center\" placeholder=\"Username\" aria-label=\"Username\" aria-describedby=\"basic-addon1\" id=\"name\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success input-normal-button\" id=\"addPlayerButton\">\n" +
    "                                        Add Player</button>\n" +
    "                                </div>\n" +
    "                            </div>"

function resetGame() {
    swal({
        buttons: true,
        dangerMode: true,
        icon: "warning",
        text: "Do you really want to reset the game?",
        title: "Are you sure?"
    })
        .then((willDelete) => {
            if (willDelete) {
                processCommand("reset", "")
            }
        });
}

function post(method, url, data) {
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",

        success: function (response) {
            data = response;
        },
        error: function (response) {
            console.log("Error")
            console.error(response);
        }
    });
}

function processCommand(cmd, data) {
    post("POST", "/command", {"cmd": cmd, "data": data}).then(() => {
        getData().then(() => {
            checkWin();
            updateInfoPanel();
            updateInputPanel();
            updateGameBoard();
            refreshOnClickEvents()
        })
    })
}

function checkWin() {
    getData().then(() => {
        let status = data.gameStatusID
        if (status === stat_gamewinner) {
            $('#testAudio').get(0).pause();
            let audio = $('#winAudio').get(0);
            audio.loop = true;
            audio.play();
            swal({
                icon: "info",
                text: "Congratulations " + data.string.gamewinner + "!\nPress OK to start a new game.",
                title: "We have winner!"
            })
                .then(() => {
                    audio.pause()
                    $('#testAudio').get(0).play()
                    processCommand("reset", "")
                });
        }
    })
}

function startGame() {
    processCommand("start", "")
}

function rollDice() {
    $('#rollModal').modal('hide');  //Close Modal
    processCommand("rollDice", "")
}

function selectFig(num) {
    processCommand("selectFig", num)
}

function figMove(direction) {
    processCommand("figMove", direction)
}

function skipMove() {
    processCommand("skip", "")
}

function addPlayer() {
    const player_name = $('#name').get(0).value;
    if (player_name === "") {
        swal({
            icon: "warning",
            text: "Blank name is not allowed!",
            title: "Error!"
        })
    } else {
        processCommand("addPlayer", player_name)
    }
}
function startDiceAudio() {
    let audio = $('#diceAudio').get(0);
    audio.loop = true;
    audio.play();
}


// On Click Events
function refreshOnClickEvents() {
    $('#resetButton').on("click", function() {
        resetGame()
    });
    $('#startButton').on("click", function() {
        startGame()
    });
    $('#diceButton').on("click", function() {
        startDiceAudio()
    });
    $('#rollModal').on("click", function() {
        rollDice()
    });
    $('#selectFig1Button').on("click", function() {
        selectFig(1)
    });
    $('#selectFig2Button').on("click", function() {
        selectFig(2)
    });
    $('#selectFig3Button').on("click", function() {
        selectFig(3)
    });
    $('#selectFig4Button').on("click", function() {
        selectFig(4)
    });
    $('#selectFig5Button').on("click", function() {
        selectFig(5)
    });
    $('#figMoveUpButton').on("click", function() {
        figMove("w")
    });
    $('#figMoveLeftButton').on("click", function() {
        figMove("a")
    });
    $('#figMoveDownButton').on("click", function() {
        figMove("s")
    });
    $('#figMoveRightButton').on("click", function() {
        figMove("d")
    });
    $('#skipMoveButton').on("click", function() {
        skipMove()
    });
    $('#addPlayerButton').on("click", function() {
        addPlayer()
    });
}
