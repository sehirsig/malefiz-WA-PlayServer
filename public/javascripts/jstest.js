function changeText() {
    console.log("Changing Text of changeMe");
    swal("Change the text below", {
        content: "input"
    })
        .then((value) => {
                document.getElementById("changeMe").innerHTML = value;
        });
}

function createBoard() {
    var x=8;
    var y=8;

    var chessBoard = document.getElementById("chessBoard");

    for (var i=0; i<y; i++){
        var row = chessBoard.appendChild(document.createElement("div"));
        for (var j=0; j<x; j++){
            row.appendChild(document.createElement("span"));
        }
    }
}

/* draggable element */
const item = document.querySelector('.item');

item.addEventListener('dragstart', dragStart);

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}


/* drop targets */
const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});


function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    // add it to the drop target
    e.target.appendChild(draggable);

    // display the draggable element
    draggable.classList.remove('hide');
}