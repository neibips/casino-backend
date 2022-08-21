const {Schema, model} = require('mongoose')

const GamesSchema = new Schema({
    walletAdress: String,
    result: Boolean,
    amount: Number,
    timeStamp: Date
})

module.exports =  model('Games', GamesSchema);
