const appNav = Vue.createApp({})

appNav.component('malefiz-nav', {
    data() {
        return {
            homeLink: "/",
            aboutLink: "/about"
        }
    },
    props: ['selected'],
    template: `
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
    `
})

appNav.mount('#malefiznavbar')