var express = require('express');
var router = express.Router();
const Games = require('../Models/gamesSchema')
const User = require("../Models/userSchema");

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const games = await Games.find().sort().select('walletAdress result amount timeStamp').limit().lean()
    games.reverse()
    res.send(games);
  }catch (e) {
    res.send(e)
  }
});

router.post('/flip', async (req, res, next) => {
  const {walletAdress, result, amount} = req.body
  const user = await User.findOne({wallet: walletAdress}).select('wallet isActive balance ')
  user.isActive = true
  if(result === true){
    user.balance += amount
  }else user.balance -= amount

  const timeStamp = Date.now()
  await Games.create({
    walletAdress,
    result,
    amount,
    timeStamp
  })
  await user.save()
  res.end()
})

router.get('/flip', async (req, res, next) => {
  const user = await User.find().select('balance')
  res.end()
})

router.post('/', async (req, res, next) => {
  const {walletAdress, amount} = req.body
  await User.create({
    wallet: walletAdress,
    balance: amount
  })
})

module.exports = router;
