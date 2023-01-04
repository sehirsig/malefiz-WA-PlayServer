const app = Vue.createApp({})

app.config.globalProperties.stat_welcome = 0
app.config.globalProperties.stat_loaded = 1
app.config.globalProperties.stat_saved = 2
app.config.globalProperties.stat_gamewinner = 3
app.config.globalProperties.stat_choosefig = 4
app.config.globalProperties.stat_idle = 5
app.config.globalProperties.stat_ready1 = 6
app.config.globalProperties.stat_ready2 = 7
app.config.globalProperties.stat_playing = 13
app.config.globalProperties.stat_moving = 14
app.config.globalProperties.stat_entername = 15

app.component('info-panel', {
    data() {
        return {
            websocketVUE: new WebSocket("ws://" + location.hostname + ":9000/websocket"),
            data: {},
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
        }
    },
    methods: {
        connectWebSocket() {
            this.websocketVUE.onopen = (event) => {
                this.websocketVUE.send("Trying to connect to Server");
            }

            this.websocketVUE.onclose = (event) => {
                this.processCommand("reset", " ")
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
                $('#backgroundAudio').get(0).pause();
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
                        $('#backgroundAudio').get(0).play()
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
                    that.checkWin()
                    that.updateGameBoard()
                }
            });
        },
        startBackgroundMusic() {
            $("#backgroundAudio").get(0).play();
        },
        startGame() {
            this.processCmdWS("start", " ")
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
                        this.processCmdWS("reset", " ")
                    }
                });
        },
        rollDice() {
            $('#rollModal').modal('hide');
            this.processCmdWS("rollDice", " ")
        },
        selectFig(num) {
            this.processCmdWS("selectFig", num)
        },
        figMove(direction) {
            this.processCmdWS("figMove", direction)
        },
        skipMove() {
            this.processCmdWS("skip", " ")
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
                this.playerNum = this.player_count + 1
                this.processCmdWS("addPlayer", player_name)
            }
        },
        startDiceAudio() {
            let audio = $('#diceAudio').get(0);
            audio.loop = true;
            audio.play();
        },
    },
    created() {
        this.getData();
        this.connectWebSocket();
    },
    template: `
        <div class="container m-1" id="information-panel">
            <p v-if="(playerNum > 0)" class="text-center">
                You are Player {{ playerNum }}
            </p>
            <p v-if="(status === stat_ready1 && playerNum === 1)" class="text-center">
                {{ gameMessage }}
            </p>
            <p v-if="(status === stat_ready1 && playerNum !== 1)" class="text-center">
                Wait for Player 1 to start <svg class="spinner" viewBox="0 0 50 50"> <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            </p>
            <p v-if="(status === stat_ready2 && playerNum === 1)" class="text-center">
                {{ gameMessage }}
            </p>
            <p v-if="(status === stat_ready2 && playerNum === 1)" class="text-center">
                {{ players }}
            </p>
            <p v-if="(status === stat_ready2 && playerNum !== 1)" class="text-center">
                Wait for Player 1 to start
            </p>
            <p v-if="((status === stat_playing) && (playerNum === turn_id))" class="text-center">
            {{ currentplayer }}
            </p>
            <p v-if="((status === stat_choosefig || status === stat_moving) && (playerNum === turn_id))" class="text-center">
            {{ currentplayer }}
            </p>
            <p v-if="((status === stat_choosefig || status === stat_moving) && (playerNum === turn_id))" class="text-center">
            {{ diceRolled }}
            </p>
            <p v-if="((0 < turn_id) && (playerNum !== turn_id) && (status === stat_playing || status === stat_choosefig || status === stat_moving) && 0 < playerNum)" class="text-center">
                Wait for Player {{ turn_id }} to end his turn<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
            </p>
            <p v-if="((status === stat_welcome || status === stat_ready1 || status === stat_idle) && (player_count < 2))" class="text-center">
                {{ atLeast2Players }}
            </p>
            <p v-if="(status === stat_welcome || status === stat_ready1 || status === stat_idle)" class="text-center">
                {{ players }}
            </p>
            <p v-if="(status === stat_gamewinner)" class="text-center">
                We have a winner ! Congratulations {{ gamewinner }} !
            </p>
            <p v-if="(playerNum === -1 && (status !== stat_welcome && status !== stat_ready1 && status !== stat_ready2 && status !== stat_idle))" class="text-center text-light">
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
                <div v-if="((status === stat_ready1 || status === stat_ready2) && playerNum === 1)" class="row m-1">
                    <div class="col text-center">
                        <button type="button" class="btn btn-warning btn-block input-warning-button" v-on:click="startGame()">
                            Start Game</button>
                    </div>
                </div>
                <div v-if="(playerNum === turn_id)">
                    <div v-if="(status === stat_playing)" class="row m-1">
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
                    <div v-if="(status === stat_choosefig)" class="row m-1">
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
                    <div v-if="(status === stat_moving)" class="row m-1">
                        <div class="col">
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('w')">
                                &#9650</button>
                        </div>
                    </div>
                    <div v-if="(status === stat_moving)" class="row m-1">
                        <div class="col btn-group justify-content-center" role="group" aria-label="First group">
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('a')">
                                &#9668</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('s')">
                                &#9660</button>
                            <button type="button" class="btn btn-secondary input-normal-button" v-on:click="figMove('d')">
                                &#9658</button>
                        </div>
                    </div>
                    <div v-if="(status === stat_moving)" class="row m-1">
                        <div class="col">
                            <button type="button" class="btn btn-warning input-warning-button" v-on:click="skipMove">
                                Skip</button>
                        </div>
                    </div>
                </div>
                <div v-if="((playerNum === -1 && player_count < 4) && (status === stat_welcome || status === stat_ready1 || status === stat_idle))" class="row m-1">
                    <div class="col text-center">
                        <input type="text" class="form-control text-center" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" id="name">
                        <button type="button" class="btn btn-success input-normal-button" v-on:click="addPlayer()">
                            Join Game</button>
                    </div>
                </div>
                <p v-if="(playerNum === -1 && (status !== stat_welcome && status !== stat_ready1 && status !== stat_ready2 && status !== stat_idle))" class="text-center text-light">
                    <svg class="spinner" viewBox="0 0 50 50"> <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>
                </p>
                <p v-if="(playerNum > 0 && playerNum !== turn_id)" class="text-center text-light">
                    Wait for your turn.
                </p>
            </div>
        </div>
        <audio loop id="winAudio" type="audio/mpeg" src="/assets/audio/win.mp3"></audio>
        <audio loop id="backgroundAudio" type="audio/mpeg" src="/assets/audio/backgroundaudio.mp3" preload="auto"></audio>
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


app.component('malefiz-nav', {
    data() {
        return {
            homeLink: "/",
            aboutLink: "/about"
        }
    },
    props: ['selected'],
    template: `
 <nav class="navbar navbar-dark navbar-expand-lg bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" id="navBrand">Malefiz</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a v-if="selected === 'home'" class="nav-link active hoverable text-center" aria-current="page" :href="homeLink">Home</a>
                    <a v-else class="nav-link hoverable text-center" :href="homeLink">Home</a>
                    <a v-if="selected === 'about'" class="nav-link active hoverable text-center" aria-current="page" :href="aboutLink">About</a>
                    <a v-else class="nav-link hoverable text-center" :href="aboutLink">About</a>
                    <button type="button" class="btn btn-dark hoverable" data-bs-toggle="modal" data-bs-target="#infoModal" >
                        <i class="bi bi-info-circle"></i>
                        Game Instructions
                    </button>
                    <div class="modal fade" id="infoModal" tabindex="-1" role="dialog" aria-labelledby="infoModalLabel" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-dialog-centered" role="document" >
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="infoModalLabel">Game Instructions</h5>
                                </div>
                                <div class="modal-body">
                                    <h3>Game Rules</h3>
                                    <em>Malefiz is a board game for 2 to 4 players. Each player has 5 figures to play with. Every figure starts in their base, at the bottom of the board. The beginning player rolls the dice. The thrown number has to be pulled completly. While walking with the figure, change of direction is not allowed. If a player lands on an enemys figure, the enemy has to put his figure back to his base. Figures are allowed to jump over other figures, but not over barricades. If a player lands on the barricade (with the exact number), the barricade gets set anywhere on the game board, all black fields are allowed, except the lowest row.
                                    </em>
                                    <h4>Goal Of The Game</h4>
                                    <em>The player reaching the top of the gameboard first (with the exact number rolled with the dice) with one figure wins the game.
                                    </em>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    `
})

app.mount('#malefiz-game')

