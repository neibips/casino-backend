const {model, Schema} = require('mongoose')

const userSchema = new Schema({
    wallet: {
        type: String,
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "balance cant be less than zero"]
    },
})

module.exports = model("User", userSchema)
