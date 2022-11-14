
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': figMove("w");
            break;
        case 'a': figMove("a");
            break;
        case 's': figMove("s");
            break;
        case 'd': figMove("d");
            break;
    }
});


