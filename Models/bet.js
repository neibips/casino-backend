const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bet = new Schema({
    user:{
        type: String,
        required: true,
        ref: "User"
    },
    factor:{
        type: Number,
        required: true
    },
    retrieveFactor:{
        type:Number
    },
    won:Boolean,
    amount:{
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Bet',Bet);
