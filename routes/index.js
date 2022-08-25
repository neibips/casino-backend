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
  console.log(result)
  if(result === true){
    user.balance += amount
  }else {
    user.balance -= amount
  }

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
  const user = await User.find().select('balance wallet')
  res.send(user)
})

router.put('/flip', async (req, res, next) => {
  const {walletAdress, amount} = req.body
  const user = await User.findOne({wallet: walletAdress}).select('wallet balance ')
  if(result === true){
    user.balance += amount
  }else {
    user.balance -= amount
  }
  await user.save()
  res.end()
})


router.post('/', async (req, res, next) => {
  let canSend = true
  const {walletAdress, amount} = req.body
  const users = await User.find().select('wallet')
  users.forEach(user => {
    if (user.wallet === walletAdress){
      canSend = false
    }
  })
  if (canSend) {
    await User.create({
      wallet: walletAdress,
      balance: amount
    })
  }

  res.end()
})

module.exports = router;
