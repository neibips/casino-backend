const {model, Schema} = require('mongoose')

const userSchema = new Schema({
    wallet: {
        type: String,
        unique: true
    },
    balance: Number,
    transactions: [String],
    isActive: Boolean
})

module.exports = model("User", userSchema)
