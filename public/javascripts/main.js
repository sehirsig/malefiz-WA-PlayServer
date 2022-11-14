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

// Game Win
function restartGame() {
    window.location.href = "/reset";
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