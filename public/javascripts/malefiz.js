//https://www.jslint.com/

function addPlayer() {
    const player_name = document.getElementById("name").value;
    if (player_name === "") {
        alertDiv("Player name can not be blank", "warning");
    } else {
        window.location.href = "/addplayer/" + player_name;
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
                window.location.href = "/reset";
            }
        });
}

function startGame() {
    window.location.href = "/start";
}

function rollDice() {
    window.location.href = "/rolldice";
}

function selectFig(num) {
    window.location.href = "/selectfig/" + num;
}

function figMove(direction) {
    window.location.href = "/move/" + direction;
}

function skipMove() {
    window.location.href = "/skip";
}

function startDiceAudio() {
    let audio = document.getElementById("diceAudio");
    audio.loop = true;
    audio.play();
}