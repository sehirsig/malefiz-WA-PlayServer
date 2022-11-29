$(document).ready(function () {
        updateGame();
        $("#testAudio").get(0).play();
        connectWebSocket();
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

function updateGame() {
    getData().then(() => {
        checkWin();
        updateInfoPanel();
        updateInputPanel();
        updateGameBoard();
        refreshOnClickEvents();
    })
}

function updateGameNoAjax() {
    checkWin();
    updateInfoPanel();
    updateInputPanel();
    updateGameBoard();
    refreshOnClickEvents();
}

function updateGameBoard() {
    for (let i = 0; i < (data.row_size * data.col_size); ++i) {
        let row = data.rows[i].row
        let col = data.rows[i].col
        let fieldID = "field\\{" + row + "\\}_\\{" + col + "\\}" // \\ für escape von jquery
        let cellString = data.rows[i].cell

        if (cellString === "InvalidCell") {
            $('#' + fieldID).attr("src", "/assets/images/game/invalid.png");
        } else if (cellString === "BlockedCell") {
            $('#' + fieldID).attr("src", "/assets/images/game/blocked.png");
        } else if (cellString === "FreeCell") {
            $('#' + fieldID).attr("src", "/assets/images/game/free.png");
        } else if (cellString === "SecureCell") {
            $('#' + fieldID).attr("src", "/assets/images/game/free.png");
        } else if (cellString === "GoalCell") {
            $('#' + fieldID).attr("src", "/assets/images/game/goal.png");
        } else if (cellString === "Start1Cell") {
            $('#' + fieldID).attr("src", "/assets/images/game/start1.png");
        } else if (cellString === "Start2Cell") {
            $('#' + fieldID).attr("src", "/assets/images/game/start2.png");
        } else if (cellString === "Start3Cell") {
            $('#' + fieldID).attr("src", "/assets/images/game/start3.png");
        } else if (cellString === "Start4Cell") {
            $('#' + fieldID).attr("src", "/assets/images/game/start4.png");
        } else if (cellString === "PlayerCell11") {
            $('#' + fieldID).attr("src", "/assets/images/game/player11.png");
        } else if (cellString === "PlayerCell12") {
            $('#' + fieldID).attr("src", "/assets/images/game/player12.png");
        } else if (cellString === "PlayerCell13") {
            $('#' + fieldID).attr("src", "/assets/images/game/player13.png");
        } else if (cellString === "PlayerCell14") {
            $('#' + fieldID).attr("src", "/assets/images/game/player14.png");
        } else if (cellString === "PlayerCell15") {
            $('#' + fieldID).attr("src", "/assets/images/game/player15.png");
        } else if (cellString === "PlayerCell21") {
            $('#' + fieldID).attr("src", "/assets/images/game/player21.png");
        } else if (cellString === "PlayerCell22") {
            $('#' + fieldID).attr("src", "/assets/images/game/player22.png");
        } else if (cellString === "PlayerCell23") {
            $('#' + fieldID).attr("src", "/assets/images/game/player23.png");
        } else if (cellString === "PlayerCell24") {
            $('#' + fieldID).attr("src", "/assets/images/game/player24.png");
        } else if (cellString === "PlayerCell25") {
            $('#' + fieldID).attr("src", "/assets/images/game/player25.png");
        } else if (cellString === "PlayerCell31") {
            $('#' + fieldID).attr("src", "/assets/images/game/player31.png");
        } else if (cellString === "PlayerCell32") {
            $('#' + fieldID).attr("src", "/assets/images/game/player32.png");
        } else if (cellString === "PlayerCell33") {
            $('#' + fieldID).attr("src", "/assets/images/game/player33.png");
        } else if (cellString === "PlayerCell34") {
            $('#' + fieldID).attr("src", "/assets/images/game/player34.png");
        } else if (cellString === "PlayerCell35") {
            $('#' + fieldID).attr("src", "/assets/images/game/player35.png");
        } else if (cellString === "PlayerCell41") {
            $('#' + fieldID).attr("src", "/assets/images/game/player41.png");
        } else if (cellString === "PlayerCell42") {
            $('#' + fieldID).attr("src", "/assets/images/game/player42.png");
        } else if (cellString === "PlayerCell43") {
            $('#' + fieldID).attr("src", "/assets/images/game/player43.png");
        } else if (cellString === "PlayerCell44") {
            $('#' + fieldID).attr("src", "/assets/images/game/player44.png");
        } else if (cellString === "PlayerCell45") {
            $('#' + fieldID).attr("src", "/assets/images/game/player45.png");
        }
    }
}

let playerNum = -1
let secretId = " "

function updateInfoPanel() {
    let status = data.gameStatusID
    const parent = $('#information-panel').get(0);
    parent.innerHTML = ""
    if (playerNum > 0) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">You are Player ${playerNum}</p>`
    }
    if (status === stat_ready1 && playerNum === 1) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.gameMessage}</p>`;
    } else if (status === stat_ready1 && playerNum !== 1) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">Wait for Player 1 to start <svg class="spinner" viewBox="0 0 50 50"> <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle> </svg> </p>`;
    }
    if (status === stat_ready2 && playerNum === 1) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.gameMessage}</p>
                        <p class="text-center">${data.string.players}</p>`;
    } else if (status === stat_ready2 && playerNum !== 1) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">Wait for Player 1 to start </p>`;
    }
    if (playerNum === data.turn_id) {
        if (status === stat_playing) {
            parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.currentplayer}</p>`;
        }
        if (status === stat_choosefig) {
            parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.currentplayer}</p>
                        <p class="text-center">${data.string.diceRolled}</p>`;
        }
        if (status === stat_moving) {
            parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.currentplayer}</p>
                    <p class="text-center">${data.string.diceRolled}</p>`;
        }
    } else if (0 < data.turn_id && (status === stat_playing || status === stat_choosefig || status === stat_moving) && 0 < playerNum) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">Wait for Player ${data.turn_id} to end his turn <svg class="spinner" viewBox="0 0 50 50"> <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle> </svg></p>`;
    }
    if (status === stat_welcome || status === stat_ready1 || status === stat_idle) {
        if (data.player_count < 2) {
            parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.atLeast2Players}</p>
                    <p class="text-center">${data.string.players}</p>`;
        } else {
            parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.players}</p>`;
        }
    }
    if (status === stat_gamewinner) {
        parent.innerHTML = parent.innerHTML + `<p class="text-center">${data.string.gamewinner}</p>`;
    }
    if (playerNum === -1 && (status !== stat_welcome && status !== stat_ready1 && status !== stat_ready2 && status !== stat_idle)) {
        parent.innerHTML = parent.innerHTML + "<p class=\"text-center text-light\">Wait for this game to end.</p>"
    }
    parent.innerHTML = parent.innerHTML + "</div>";
}

function updateInputPanel() {
    let status = data.gameStatusID

    const parent = $('#input-panel-group').get(0);

    parent.innerHTML = "";
    if (playerNum === 1) {
        parent.innerHTML = sResetButton;
    }

    parent.innerHTML = parent.innerHTML + "<div class=\"row justify-content-center\">";
    if (status === stat_ready1 && playerNum === 1) {
        parent.innerHTML = parent.innerHTML + sStartGame;
    }
    if (status === stat_ready2 && playerNum === 1) {
        parent.innerHTML = parent.innerHTML + sStartGame + "</div>";
    }
    if (playerNum === data.turn_id) {
        if (status === stat_playing) {
            parent.innerHTML = parent.innerHTML + sRollDice + "</div>";
        }
        if (status === stat_choosefig) {
            parent.innerHTML = parent.innerHTML + sChooseFig + "</div>";
        }
        if (status === stat_moving) {
            parent.innerHTML = parent.innerHTML + sMoving + "</div>";
        }
    }
    if (playerNum === -1 && data.player_count < 4) {
        if (status === stat_welcome || status === stat_ready1 || status === stat_idle) {
            parent.innerHTML = parent.innerHTML + sUserAdd + "</div>";
        }
    }
    if (playerNum === -1 && (status !== stat_welcome && status !== stat_ready1 && status !== stat_ready2 && status !== stat_idle)) {
        parent.innerHTML = parent.innerHTML + "<p class=\"text-center text-light\"><svg class=\"spinner\" viewBox=\"0 0 50 50\"> <circle class=\"path\" cx=\"25\" cy=\"25\" r=\"20\" fill=\"none\" stroke-width=\"5\"></circle> </svg></p>"
    }
    if (playerNum > 0 && playerNum !== data.turn_id) {
        parent.innerHTML = parent.innerHTML + "<p class=\"text-center text-light\">Wait for your turn.</p>"
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
    "                                        Join Game</button>\n" +
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
                //processCommand("reset", "")
                processCmdWS("reset", " ")
            }
        });
}

function post(method, url, returnData, cmd) {
    return $.ajax({
        method: method,
        url: url,
        data: JSON.stringify(returnData),
        dataType: "json",
        contentType: "application/json",

        success: function (response) {
            data = response;
            if (cmd === "addPlayer") {
                secretId = data.secretId
            }
        },
        error: function (response) {
            console.log("Error")
            console.error(response);
        }
    });
}

function processCommand(cmd, returnData) {
    if (cmd === "addPlayer") {
        playerNum = data.player_count + 1 //Get his player number
    }
    post("POST", "/command", {"cmd": cmd, "data": returnData, "secretId": secretId.toString()}, cmd).then(() => {
        //updateGame(); //Return players special secret ID
    })
}

function checkWin() {
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
                //processCommand("reset", "")
                processCmdWS("reset", " ")
            });
    }
}

function startGame() {
    //processCommand("start", "")
    processCmdWS("start", " ")
}

function rollDice() {
    $('#rollModal').modal('hide');  //Close Modal
    //processCommand("rollDice", "")
    processCmdWS("rollDice", " ")
}

function selectFig(num) {
    //processCommand("selectFig", num)
    processCmdWS("selectFig", num)
}

function figMove(direction) {
    //processCommand("figMove", direction)
    processCmdWS("figMove", direction)
}

function skipMove() {
    //processCommand("skip", "")
    processCmdWS("skip", " ")
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
        playerNum = data.player_count + 1
        processCmdWS("addPlayer", player_name)
        //processCommand("addPlayer", player_name)
    }
}

function processCmdWS(cmd, data) {
    websocket.send(cmd + "|" + data + "|" + secretId)
}

function startDiceAudio() {
    let audio = $('#diceAudio').get(0);
    audio.loop = true;
    audio.play();
}


// On Click Events
function refreshOnClickEvents() {
    $('#resetButton').click(function () {
        resetGame()
    });
    $('#startButton').click(function () {
        startGame()
    });
    $('#diceButton').click(function () {
        startDiceAudio()
    });
    $('#rollModal').click(function () {
        rollDice()
    });
    $('#selectFig1Button').click(function () {
        selectFig(1)
    });
    $('#selectFig2Button').click(function () {
        selectFig(2)
    });
    $('#selectFig3Button').click(function () {
        selectFig(3)
    });
    $('#selectFig4Button').click(function () {
        selectFig(4)
    });
    $('#selectFig5Button').click(function () {
        selectFig(5)
    });
    $('#figMoveUpButton').click(function () {
        figMove("w")
    });
    $('#figMoveLeftButton').click(function () {
        figMove("a")
    });
    $('#figMoveDownButton').click(function () {
        figMove("s")
    });
    $('#figMoveRightButton').click(function () {
        figMove("d")
    });
    $('#skipMoveButton').click(function () {
        skipMove()
    });
    $('#addPlayerButton').click(function () {
        addPlayer()
    });
    $('#chatButton').click(function () {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-500,top=-500`;
        window.open('/chat', 'test', params)
    });
}

// Websockets
let websocket = new WebSocket("ws://localhost:9000/websocket");
window.onbeforeunload = function () {
    websocket.onclose = function () {
        if (playerNum > 0 && playerNum < 5) {
            processCommand("reset", "")
        }
    };
    websocket.close();
};

function connectWebSocket() {

    websocket.onopen = function (event) {
        websocket.send("Trying to connect to Server");
    }

    websocket.onclose = function () {
        if (playerNum > 0 && playerNum < 5) {
            processCommand("reset", "")
        }
    };

    websocket.onerror = function (error) {
    };

    websocket.onmessage = function (e) {
        if (typeof e.data === "string") {
            data = JSON.parse(e.data)
            if (data.reset === 1) {
                playerNum = -1
                swal({
                    icon: "warning",
                    text: "Game has been reset! (Player left or game master chose to)",
                    title: "Error!"
                })
            }
            if (data.secretId.length > 1) {
                secretId = data.secretId
            }
            updateGameNoAjax()
        }
    };
}
