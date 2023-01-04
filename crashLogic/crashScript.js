const Crash = require('../Models/crashGame')
const {webcrypto: crypto} = require("crypto");

function getCrashPoint() {
    const e = 2**32
    const h = crypto.getRandomValues(new Uint32Array(1))[0]
    return Math.floor((100*e-h) / (e-h)) / 100
}

async function createGame() {
    return await Crash.create({
        factor: 1,
        active: true,
        timeStamp: Date.now()
    })
}

module.exports = async function crashLogic() {
    //START LOGIC
    async function logic (){
        let start = 1
        let speed = 1
        let timer = 10
        const newGame = await createGame()
        const finalFactor = getCrashPoint()
        const stepFactor = 0.01

        //game start
        const activeGame = setInterval(() => {
            if (start <= finalFactor){
                start += stepFactor * speed
                speed += 0.01
            }else {
                clearInterval(activeGame)
                newGame.finalFactor = finalFactor
                setTimeout(async () => {
                    newGame.active = false
                    console.log(newGame.timeStamp + " with koef " + finalFactor)
                    await newGame.save()
                    setInterval(() => timer -= stepFactor, 100)
                    setTimeout(async () => {
                        logic()
                    }, 10000)
                }, 2000)
            }
        }, 10)
    }
    logic();
}


