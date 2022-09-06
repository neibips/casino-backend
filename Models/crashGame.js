const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Crash = new Schema({
    finalFactor: {
        type: Number,
    },
    factor:{
        type: Number,               // we generate it from the start
    },
    state:{
        type:String,
        required: true,
        default:'makingBets'
    },
    timerStart:{
        type: Number,
        required: true,
        default: 10000
    },
    timerFinish:{
        type: Number,
        required: true,
        default:2000
    },
    active: Boolean,
    timeStamp: {
        type: Date,
        required: true,
        default: Date.now()
    },
    bets:[],
})

module.exports = mongoose.model('Crash',Crash);
