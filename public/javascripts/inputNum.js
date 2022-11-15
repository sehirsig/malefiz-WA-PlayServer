
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "1": selectFig(1);
        break;
        case "2": selectFig(2);
        break;
        case "3": selectFig(3);
        break;
        case "4": selectFig(4);
        break;
        case "5": selectFig(5);
        break;
    }
});

function selectFig(num) {
    window.location.href = "/selectfig/" + num;
}
