var express = require('express');
var router = express.Router();
const Games = require('../Models/gamesSchema')

/* GET home page. */
router.get('/', async function(req, res, next) {
  try{
    const timeStamp = Date.now()
    await Games.create({
      walletAdress: '21',
      result: true,
      amount: 2,
      timeStamp
    })
    const games = await Games.find().sort().select('walletAdress result amount timeStamp').limit().lean()
    games.reverse()
    res.send(games);
  }catch (e) {
    res.send(e)
  }
});

router.post('/flip', async (req, res, next) => {
  const {walletAdress, result, amount} = req.body
  const timeStamp = Date.now().toLocaleString()
  await Games.create({
    walletAdress,
    result,
    amount,
    timeStamp
  })
  res.end()
})

module.exports = router;
