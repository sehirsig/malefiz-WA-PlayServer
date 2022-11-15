
let rClicked = false;

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "r": document.getElementById("diceButton").click(); rClicked = true;
            break;
        case "Enter": if(rClicked) {document.getElementById("rollModal").click()};
            break;
    }
});