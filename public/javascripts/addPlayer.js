function addPlayer() {
    player_name = document.getElementById('name').value;
    if (player_name === "") {
        alertDiv("Player name can not be blank", 'warning')
    } else {
        window.location.href = "/addplayer/" + player_name;
    }
}

const alertPlaceholder = document.getElementById('alertPlaceholder')

const alertDiv = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}