
const app = Vue.createApp({})


app.component('info-panel', {
    data() {
        return {
            count: 0
        }
    },
    template: `
        <div class="container m-1" id="information-panel"></div>
        <div class="container m-1" id="input-panel-group"></div>
    `
})


app.component('gameboard', {
    data() {
        return {
            count: 0
        }
    },
    template: `
        <div class="container p-0 m-1" id="gamepanel">
            <div v-for="(n, i) in 18" :key="i" class="row justify-content-center">
                <div v-for="(n, j) in 19" :key="j" class="col p-0 m-0">
                    <img class="game-field" :id="'field{'+ i +'}_{'+ j +'}'"/>
                </div>
            </div>
        </div>
    `
})

app.mount('#malefiz-game')

