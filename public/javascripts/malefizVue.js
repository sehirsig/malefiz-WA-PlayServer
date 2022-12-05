$(document).ready(function () {
        $("#testAudio").get(0).play();
    }
)

const app = Vue.createApp({
    data() {
        return {
            websocketVUE: new WebSocket("ws://" + location.hostname + ":9000/websocket"),
            data: {},
            rows: [],
            row_size: -1,
            col_size: -1,
            status: 0, //status kann auch gelöscht und mit data.status aufgerufen werden. (Das wären offline daten.
            gameMessage: " ",
            atLeast2Players: " ",
            players: " ",
            currentplayer: " ",
            diceRolled: " ",
            gamewinner: " ",
            turn_id: 0,
            player_count: 0,
            reset: 0,
            secretId: " ",
            playerNum: -1,
            stat_welcome: 0,
            stat_loaded: 1,
            stat_saved: 2,
            stat_gamewinner: 3,
            stat_choosefig: 4,
            stat_idle: 5,
            stat_ready1: 6,
            stat_ready2: 7,
            stat_playing: 13,
            stat_moving: 14,
            stat_entername: 15,
        }
    },
    methods: {
        connectWebSocket() {
            this.websocketVUE.onopen = (event) => {
                this.websocketVUE.send("Trying to connect to Server");
            }

            this.websocketVUE.onclose = (event) => {
                this.processCommand("reset", "")
            };

            this.websocketVUE.onerror = (event) => {
            };

            this.websocketVUE.onmessage = (event) => {
                if (typeof event.data === "string") {
                    this.data = JSON.parse(event.data)

                    if (this.data.reset === 1) {
                        this.playerNum = -1
                        swal({
                            icon: "warning",
                            text: "Game has been reset! (Player left or game master chose to)",
                            title: "Error!"
                        })
                    }
                    if (this.data.secretId.length > 1) {
                        this.secretId = this.data.secretId
                    }
                    this.status = this.data.gameStatusID
                    this.gameMessage =  this.data.string.gameMessage
                    this.atLeast2Players = this.data.string.atLeast2Players
                    this.players = this.data.string.players
                    this.currentplayer = this.data.string.currentplayer
                    this.diceRolled = this.data.string.diceRolled
                    this.gamewinner = this.data.string.gamewinner
                    this.turn_id = this.data.turn_id
                    this.player_count = this.data.player_count
                    this.reset = this.data.reset
                    this.checkWin()
                    this.updateGameBoard()
                }
            };
        },
        startDiceAudio() {
            let audio = $('#diceAudio').get(0);
            audio.loop = true;
            audio.play();
        },
        processCmdWS(cmd, data) {
            this.websocketVUE.send(cmd + "|" + data + "|" + this.secretId)
        },
        processCommand(cmd, returnData) {
            this.post("POST", "/command", {"cmd": cmd, "data": returnData, "secretId": this.secretId.toString()}, cmd).then(() => {
            })
        },
        post(method, url, returnData, cmd) {
            return $.ajax({
                method: method,
                url: url,
                data: JSON.stringify(returnData),
                dataType: "json",
                contentType: "application/json",

                success: function (response) {
                    this.data = response;
                },
                error: function (response) {
                    console.log("Error")
                    console.error(response);
                }
            });
        },
        checkWin() {
            if (this.status === this.stat_gamewinner) {
                $('#testAudio').get(0).pause();
                let audio = $('#winAudio').get(0);
                audio.loop = true;
                audio.play();
                swal({
                    icon: "info",
                    text: "Congratulations " + this.gamewinner + "!\nPress OK to start a new game.",
                    title: "We have winner!"
                })
                    .then(() => {
                        audio.pause()
                        $('#testAudio').get(0).play()
                        this.processCmdWS("reset", " ")
                    });
            }
        },
        updateGameBoard() {
            for (let i = 0; i < (18 * 19); ++i) {
                let row = this.data.rows[i].row
                let col = this.data.rows[i].col
                let fieldID = "field\\{" + row + "\\}_\\{" + col + "\\}" // \\ für escape von jquery
                let cellString = this.data.rows[i].cell

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
        },
        getData() {
            let that = this;

            return $.ajax({
                method: "GET",
                url: "/status",
                dataType: "json",
                success: function (response) {
                    that.data = response;
                    that.status = response.gameStatusID
                    that.gameMessage =  response.gameMessage
                    that.atLeast2Players = response.string.atLeast2Players
                    that.players = response.string.players
                    that.currentplayer = response.string.currentplayer
                    that.diceRolled = response.string.diceRolled
                    that.gamewinner = response.string.gamewinner
                    that.turn_id = response.turn_id
                    that.player_count = response.player_count
                    that.reset = response.reset
                    that.updateGameBoard()
                }
            });
        }
    },
    created() {
        this.getData();
        this.connectWebSocket();
    },
})

app.component('info-panel', {
    methods: {
        startGame() {
            this.$root.processCmdWS("start", " ")
        },
        resetGame() {
            swal({
                buttons: true,
                dangerMode: true,
                icon: "warning",
                text: "Do you really want to reset the game?",
                title: "Are you sure?"
            })
                .then((willDelete) => {
                    if (willDelete) {
                        this.$root.processCmdWS("reset", " ")
                    }
                });
        },
        rollDice() {
            $('#rollModal').modal('hide');
            this.$root.processCmdWS("rollDice", " ")
        },
        selectFig(num) {
            this.$root.processCmdWS("selectFig", num)
        },
        figMove(direction) {
            this.$root.processCmdWS("figMove", direction)
        },
        skipMove() {
            this.$root.processCmdWS("skip", " ")
        },
        addPlayer() {
            const player_name = $('#name').get(0).value;
            if (player_name === "") {
                swal({
                    icon: "warning",
                    text: "Blank name is not allowed!",
                    title: "Error!"
                })
            } else {
                this.$root.playerNum = this.$root.player_count + 1
                this.$root.processCmdWS("addPlayer", player_name)
            }
        },
    },
    template: `
        <div class="container m-1" id="information-panel">
            <p v-if="($root.playerNum > 0)" class="text-center">
                You are Player {{ $root.playerNum }}
            </p>
            <p v-if="($root.status === $root.stat_ready1 && $root.playerNum === 1)" class="text-center">
                {{ $root.gameMessage }}
            </p>
            <p v-if="($root.status === $root.stat_ready1 && $root.playerNum !== 1)" class="text-center">
                Wait for Player 1 to start <svg class="spinner" viewBox="0 0 50 50"> <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            </p>
            <p v-if="($root.status === $root.stat_ready2 && $root.playerNum === 1)" class="text-center">
                {{ $root.gameMessage }}
            </p>
            <p v-if="($root.status === $root.stat_ready2 && $root.playerNum === 1)" class="text-center">
                {{ $root.players }}
            </p>
            <p v-if="($root.status === $root.stat_ready2 && $root.playerNum !== 1)" class="text-center">
                Wait for Player 1 to start
            </p>
            <p v-if="(($root.status === $root.stat_playing) && ($root.playerNum === $root.turn_id))" class="text-center">
            {{ $root.currentplayer }}
            </p>
            <p v-if="(($root.status === $root.stat_choosefig || $root.status === $root.stat_moving) && ($root.playerNum === $root.turn_id))" class="text-center">
            {{ $root.currentplayer }}
            </p>
            <p v-if="(($root.status === $root.stat_choosefig || $root.status === $root.stat_moving) && ($root.playerNum === $root.turn_id))" class="text-center">
            {{ $root.diceRolled }}
            </p>
            <p v-if="((0 < $root.turn_id) && ($root.playerNum !== $root.turn_id) && ($root.status === $root.stat_playing || $root.status === $root.stat_choosefig || $root.status === $root.stat_moving) && 0 < $root.playerNum)" class="text-center">
                Wait for Player {{ $root.turn_id }} to end his turn<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            </p>
            <p v-if="(($root.status === $root.stat_welcome || $root.status === $root.stat_ready1 || $root.status === $root.stat_idle) && ($root.player_count < 2))" class="text-center">
                {{ $root.atLeast2Players }}
            </p>
            <p v-if="($root.status === $root.stat_welcome || $root.status === $root.stat_ready1 || $root.status === $root.stat_idle)" class="text-center">
                {{ $root.players }}
            </p>
            <p v-if="($root.status === $root.stat_gamewinner)" class="text-center">
                We have a winner ! Congratulations {{ $root.gamewinner }} !
            </p>
            <p v-if="($root.playerNum === -1 && ($root.status !== $root.stat_welcome && $root.status !== $root.stat_ready1 && $root.status !== $root.stat_ready2 && $root.status !== $root.stat_idle))" class="text-center text-light">
                Wait for this game to end.
            </p>
        </div>
        <div class="container m-1" id="input-panel-group">
            <div class="row justify-content-center"> 
                <div class="row justify-content-center">
                    <div class="row m-1">
                        <div class="col text-center">
                            <button type="button" class="btn btn-danger input-critical-button" v-on:click="resetGame()">
                                Reset Game &#8634
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="(($root.status === $root.stat_ready1 || $root.status === $root.stat_ready2) && $root.playerNum === 1)" class="row m-1">
                    <div class="col text-center">
                        <button type="button" class="btn btn-warning btn-block input-warning-button" v-on:click="startGame()">
                            Start Game</button>
                    </div>
                </div>
                <div v-if="($root.playerNum === $root.turn_id)">
                    <div v-if="($root.status === $root.stat_playing)" class="row m-1">
                        <div class="col">
                            <button type="button" v-on:click="startDiceAudio()" class="btn btn-success btn-block input-normal-button" data-bs-toggle="modal" data-bs-target="#rollModal">
                                Roll Dice</button>
                            <div class="modal" id="rollModal" v-on:click="rollDice()" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true" data-backdrop="false">
                                <div class="modal-dialog modal-dialog-centered" role="document" >
                                    <div class="modal-content" id="diceModal">
                                        <div class="modal-body">
                                            <div class='box'>
                                                <div class="cube">
                                                    <div class="side  front">1</div>
                                                    <div class="side   back">6</div>
                                                    <div class="side  right">3</div>
                                                    <div class="side   left">4</div>
                                                    <div class="side    top">2</div>
                                                    <div class="side bottom">5</div>
                                                </div>
                                            </div>
                                            <audio id="diceAudio" type="audio/mpeg" src="/assets/audio/dice-shaking.mp3">
                                            </audio>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="($root.status === $root.stat_choosefig)" class="row m-1">
                        <div class="col btn-group justify-content-center" role="group" aria-label="First group">
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="selectFig(1)">
                                1</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="selectFig(2)">
                                2</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="selectFig(3)">
                                3</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="selectFig(4)">
                                4</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="selectFig(5)">
                                5</button>
                        </div>
                    </div>
                    <div v-if="($root.status === $root.stat_moving)" class="row m-1">
                        <div class="col">
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('w')">
                                &#9650</button>
                        </div>
                    </div>
                    <div v-if="($root.status === $root.stat_moving)" class="row m-1">
                        <div class="col btn-group justify-content-center" role="group" aria-label="First group">
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('a')">
                                &#9668</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('s')">
                                &#9660</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('d')">
                                &#9658</button>
                        </div>
                    </div>
                    <div v-if="($root.status === $root.stat_moving)" class="row m-1">
                        <div class="col">
                            <button type="button" class="btn btn-warning input-warning-button" v-on:click="skipMove">
                                Skip</button>
                        </div>
                    </div>
                </div>
                <div v-if="(($root.playerNum === -1 && $root.player_count < 4) && ($root.status === $root.stat_welcome || $root.status === $root.stat_ready1 || $root.status === $root.stat_idle))" class="row m-1">
                    <div class="col text-center">
                        <input type="text" class="form-control text-center" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" id="name">
                        <button type="button" class="btn btn-success input-normal-button" v-on:click="addPlayer()">
                            Join Game</button>
                    </div>
                </div>
                <p v-if="($root.playerNum === -1 && ($root.status !== $root.stat_welcome && $root.status !== $root.stat_ready1 && $root.status !== $root.stat_ready2 && $root.status !== $root.stat_idle))" class="text-center text-light">
                    <svg class="spinner" viewBox="0 0 50 50"> <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
                </p>
                <p v-if="($root.playerNum > 0 && $root.playerNum !== $root.turn_id)" class="text-center text-light">
                    Wait for your turn.
                </p>
            </div> </div>
    `
})


app.component('gameboard', {
    template: `
        <div class="container p-0 m-1" id="gamepanel">
            <div v-for="(n, i) in 18" :key="i" class="row justify-content-center">
                <div v-for="(k, j) in 19" :key="j" class="col p-0 m-0">
                    <img class="game-field" :id="'field{'+ i +'}_{'+ j +'}'"/>
                </div>
            </div>
        </div>
    `
})

app.mount('#malefiz-game')

