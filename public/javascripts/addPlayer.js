function addPlayer() {
    player_name = document.getElementById('name').value;
    if (player_name == "") {
        alert("Player name can not be blank")
    } else {
        window.location.href = "/addplayer/" + player_name;
    }
}