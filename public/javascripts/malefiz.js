
$(document).ready(function () {
        updateInfoPanel();
        updateInputPanel();
        updateGameBoard();
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
    getData().then(() => {
        for (let i = 0; i < (data.row_size * data.col_size); ++i) {
            let row = data.rows[i].row
            let col = data.rows[i].col
            let fieldID = "field{" + row + "}_{" + col + "}"
            let cellString = data.rows[i].cell
            if (fieldID === "field113") {
                alert(cellString)
            }
            if (cellString === "InvalidCell") {
                document.getElementById(fieldID).src = "/assets/images/game/invalid.png";
            } else if (cellString === "BlockedCell") {
                document.getElementById(fieldID).src = "/assets/images/game/blocked.png";
            } else if (cellString === "FreeCell") {
                document.getElementById(fieldID).src = "/assets/images/game/free.png";
            } else if (cellString === "SecureCell") {
                document.getElementById(fieldID).src = "/assets/images/game/free.png";
            } else if (cellString === "GoalCell") {
                document.getElementById(fieldID).src = "/assets/images/game/free.png";
            } else if (cellString === "Start1Cell") {
                document.getElementById(fieldID).src = "/assets/images/game/start1.png";
            } else if (cellString === "Start2Cell") {
                document.getElementById(fieldID).src = "/assets/images/game/start2.png";
            } else if (cellString === "Start3Cell") {
                document.getElementById(fieldID).src = "/assets/images/game/start3.png";
            } else if (cellString === "Start4Cell") {
                document.getElementById(fieldID).src = "/assets/images/game/start4.png";
            } else if (cellString === "PlayerCell11") {
                document.getElementById(fieldID).src = "/assets/images/game/player11.png";
            } else if (cellString === "PlayerCell12") {
                document.getElementById(fieldID).src = "/assets/images/game/player12.png";
            } else if (cellString === "PlayerCell13") {
                document.getElementById(fieldID).src = "/assets/images/game/player13.png";
            } else if (cellString === "PlayerCell14") {
                document.getElementById(fieldID).src = "/assets/images/game/player14.png";
            } else if (cellString === "PlayerCell15") {
                document.getElementById(fieldID).src = "/assets/images/game/player15.png";
            } else if (cellString === "PlayerCell21") {
                document.getElementById(fieldID).src = "/assets/images/game/player21.png";
            } else if (cellString === "PlayerCell22") {
                document.getElementById(fieldID).src = "/assets/images/game/player22.png";
            } else if (cellString === "PlayerCell23") {
                document.getElementById(fieldID).src = "/assets/images/game/player23.png";
            } else if (cellString === "PlayerCell24") {
                document.getElementById(fieldID).src = "/assets/images/game/player24.png";
            } else if (cellString === "PlayerCell25") {
                document.getElementById(fieldID).src = "/assets/images/game/player25.png";
            } else if (cellString === "PlayerCell31") {
                document.getElementById(fieldID).src = "/assets/images/game/player31.png";
            } else if (cellString === "PlayerCell32") {
                document.getElementById(fieldID).src = "/assets/images/game/player32.png";
            } else if (cellString === "PlayerCell33") {
                document.getElementById(fieldID).src = "/assets/images/game/player33.png";
            } else if (cellString === "PlayerCell34") {
                document.getElementById(fieldID).src = "/assets/images/game/player4.png";
            } else if (cellString === "PlayerCell35") {
                document.getElementById(fieldID).src = "/assets/images/game/player35.png";
            } else if (cellString === "PlayerCell41") {
                document.getElementById(fieldID).src = "/assets/images/game/player41.png";
            } else if (cellString === "PlayerCell42") {
                document.getElementById(fieldID).src = "/assets/images/game/player42.png";
            } else if (cellString === "PlayerCell43") {
                document.getElementById(fieldID).src = "/assets/images/game/player43.png";
            } else if (cellString === "PlayerCell44") {
                document.getElementById(fieldID).src = "/assets/images/game/player44.png";
            } else if (cellString === "PlayerCell45") {
                document.getElementById(fieldID).src = "/assets/images/game/player45.png";
            }
        }
    })
}

function updateInfoPanel() {
    getData().then(() => {
        let status = data.gameStatusID
        const parent = document.getElementById("information-panel");
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
    })
}

function updateInputPanel() {
    getData().then(() => {
        let status = data.gameStatusID

        const parent = document.getElementById("input-panel-group");
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
    })
}

let sResetButton = "<div class=\"row justify-content-center\">\n" +
    "                        <div class=\"row m-1\">\n" +
    "                            <div class=\"col text-center\">\n" +
    "                                <button type=\"button\" class=\"btn btn-danger input-critical-button\" onclick=\"resetGame()\">\n" +
    "                                    Reset Game &#8634\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>"

let sStartGame = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col text-center\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-warning btn-block input-warning-button\" onclick=\"startGame()\">\n" +
    "                                        Start Game</button>\n" +
    "                                </div>\n" +
    "                            </div>"

let sRollDice = "<script src='/assets/javascripts/inputDice.js' type=\"text/javascript\"></script>\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col\">\n" +
    "                                    <button type=\"button\" id=\"diceButton\" class=\"btn btn-success btn-block input-normal-button\" data-bs-toggle=\"modal\" data-bs-target=\"#rollModal\" onclick=\"startDiceAudio()\">\n" +
    "                                        Roll Dice</button>\n" +
    "                                    <div class=\"modal\" id=\"rollModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"infoModalLabel\" aria-hidden=\"true\" data-backdrop=\"false\" onclick=\"rollDice()\">\n" +
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

let sChooseFig = "<script src='/assets/javascripts/inputNum.js' type=\"text/javascript\"></script>\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col btn-group justify-content-center\" role=\"group\" aria-label=\"First group\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"selectFig(1)\">\n" +
    "                                        1</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"selectFig(2)\">\n" +
    "                                        2</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"selectFig(3)\">\n" +
    "                                        3</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"selectFig(4)\">\n" +
    "                                        4</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"selectFig(5)\">\n" +
    "                                        5</button>\n" +
    "                                </div>\n" +
    "                            </div>"

let sMoving = "<script src='/assets/javascripts/inputWASD.js' type=\"text/javascript\"></script>\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"figMove('w')\">\n" +
    "                                        &#9650</button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col btn-group justify-content-center\" role=\"group\" aria-label=\"First group\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"figMove('a')\">\n" +
    "                                        &#9668</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"figMove('s')\">\n" +
    "                                        &#9660</button>\n" +
    "                                    <button type=\"button\" class=\"btn btn-secondary input-normal-button\" onclick=\"figMove('d')\">\n" +
    "                                        &#9658</button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-warning input-warning-button\" onclick=\"skipMove()\">\n" +
    "                                        Skip</button>\n" +
    "                                </div>\n" +
    "                            </div>"

let sUserAdd = "<div class=\"row m-1\">\n" +
    "                                <div class=\"col text-center\">\n" +
    "                                    <input type=\"text\" class=\"form-control text-center\" placeholder=\"Username\" aria-label=\"Username\" aria-describedby=\"basic-addon1\" id=\"name\">\n" +
    "                                    <button type=\"button\" class=\"btn btn-success input-normal-button\" onclick=\"addPlayer()\">\n" +
    "                                        Add Player</button>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"row m-1\">\n" +
    "                                <div class=\"col text-center\">\n" +
    "                                    <div id=\"alertPlaceholder\"></div>\n" +
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
        checkWin(); //Momentan 4x getData, auf eins beschränken?
        updateInfoPanel()
        updateInputPanel()
        updateGameBoard();
    })
}

function checkWin() {
    getData().then(() => {
        let status = data.gameStatusID
        if (status === stat_gamewinner) {
            swal({
                icon: "info",
                text: "Congratulations " + data.string.gamewinner + "!\nPress OK to start a new game.",
                title: "We have winner!"
            })
                .then(() => {
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
    const player_name = document.getElementById("name").value;
    if (player_name === "") {
        alertDiv("Player name can not be blank", "warning");
    } else {
        processCommand("addPlayer", player_name)
    }
}

const alertPlaceholder = document.getElementById("alertPlaceholder");

function alertDiv(message, type) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        `   <button type="button" class="btn-close" data-bs-dismiss="alert"
   aria-label="Close"></button>`,
        `</div>`
    ].join("");

    alertPlaceholder.append(wrapper);
}

function startDiceAudio() {
    let audio = document.getElementById("diceAudio");
    audio.loop = true;
    audio.play();
}
