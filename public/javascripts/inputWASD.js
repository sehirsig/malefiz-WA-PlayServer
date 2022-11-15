
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w": figMove("w");
            break;
        case "ArrowUp": figMove("w");
            break;
        case "a": figMove("a");
            break;
        case "ArrowLeft": figMove("a");
            break;
        case "s": figMove("s");
            break;
        case "ArrowDown": figMove("s");
            break;
        case "d": figMove("d");
            break;
        case "ArrowRight": figMove("d");
            break;
        case "Enter": skipMove();
            break;
    }
});

function figMove(direction) {
    window.location.href = "/move/" + direction;
}

function skipMove() {
    window.location.href = "/skip";
}
