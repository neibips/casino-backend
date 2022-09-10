const app = require('./app')
const mongoose = require('mongoose')
const User = require('./Models/userSchema')
const Crash = require('./Models/crashGame')

async function startDB () {
    await mongoose.connect('mongodb+srv://admin:admin@casinoghost.0s9watd.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,

        keepAlive: true,

    }).then(() => {
        console.log('database successful connected')
    })
}

mongoose.connection.on('error', err => {
    console.log(err);
});

const PORT =  4000

const server = app.listen(process.env.PORT || PORT, () => {
    startDB()
    console.log(`App running on port ${PORT}...`);

});
//socket io
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
})

const {webcrypto: crypto} = require("crypto");

function getCrashPoint() {
    const e = 2**32
    const h = crypto.getRandomValues(new Uint32Array(1))[0]
    return Math.floor((100*e-h) / (e-h)) / 100
}

async function createGame() {
    return await Crash.create({
        factor: 1,
        active: false,
        timeStamp: Date.now()
    })
}
let start = 1
let speed = 1
let timer = 12
let newGame;
const crashLogic = async() => {
    newGame = await Crash.findOne().sort({_id: -1})


    //START LOGIC
    async function logic (){
        newGame.active = true
        await newGame.save()
        const finalFactor = getCrashPoint()
        const stepFactor = 0.01

        //game start
        const activeGame = setInterval(async () => {
            if (start <= finalFactor){
                start += stepFactor * speed
                speed += stepFactor
            }else {
                clearInterval(activeGame)
                const timerInterval = setInterval(() => {
                    timer -= 0.1
                }, 100)
                io.emit('final factor', finalFactor)
                newGame.finalFactor = finalFactor
                newGame.active = false
                await newGame.save()
                newGame = await createGame()
                setTimeout(async () => {
                    clearInterval(timerInterval)
                    start = 1
                    speed = 1
                    timer = 12
                    logic()
                }, 12000)
            }
        }, 100)
    }
    logic()
}
crashLogic()


io.on('connection', async (socket) => {
    const lastGame = await Crash.findOne().sort({_id: -1})
    if (lastGame.active === false) {
        socket.emit('timer', timer)
    }else{
        socket.emit('game', {
            start,
            speed
        })
    }

    const lastGames = await Crash.find().sort({_id: -1}).limit(11).select('finalFactor')
    io.emit('last games', lastGames)

    socket.on('get games', async () => {
        const lastGames = await Crash.find().sort({_id: -1}).limit(11).select('finalFactor')
        io.emit('last games', lastGames)
    })

    socket.on('request balance', async (data) => {
        const user = await User.findOne({wallet: data}).select('balance').lean()
        if (user === undefined){
            socket.emit('bid error', 'Troubles with your account')
        }else socket.emit('update balance', user.balance)
    })

    socket.on('new bid', async (data) => {
        if (newGame !== undefined){
            if (newGame.active === false){
                newGame.bets.push({
                    player: data.wallet,
                    amount: data.amount,
                    win: false
                })

                await newGame.save()
                const user = await User.findOne({wallet: data.wallet})
                user.balance -= data.amount
                await user.save()
                socket.emit('update balance1', user.balance)
                socket.emit('bid accepted', 'Your bid successfully accepted')
            } else{
                socket.emit('bid error', 'You cant make a bid')
            }
        }
    })

    socket.on('take', async (data) => {
        if (newGame.active && !newGame.finalFactor) {
            const bid = newGame.bets.find((el,index) => {
                if (el.player === data){
                    return {
                        player: el.player,
                        amount: el.amount
                    }
                }
            })
            if (bid.win === false){
                bid.win = true
                const user = await User.findOne({wallet: data})
                user.balance += start * (bid.amount * 1)
                await user.save()
                await newGame.save()
                socket.emit('update balance2', user.balance)
                socket.emit('winwin', ' ')
            }
        }
    })

    socket.on('getUserAccount', async (data) => {
        const user = await User.findOne({wallet: data.wallet}).select('wallet balance')
        const bid = newGame.bets.find((el,index) => {
            if (el.player === data.wallet){
                return {
                    player: el.player,
                    amount: el.amount
                }
            }
        })

        socket.emit('getUserAccount', {
            balance: user.balance,

            bid
        })
    })
    socket.on('chat message', (data) => {
        io.emit('chat message', {
            text: data.text,
            wallet: data.wallet
        })
    })
    socket.on('updateWindow', async () => {
        console.log('need to update window');
        const lastGame = await Crash.findOne().sort({_id: -1})
        if (lastGame.active === false) {
            socket.emit('update timer', timer)
        }else{
            socket.emit('update game', {
                start,
                speed
            })
        }
    })
})
