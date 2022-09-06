const crypto = require('crypto').webcrypto

function getCrashPoint() {
    const e = 2**32
    const h = crypto.getRandomValues(new Uint32Array(1))[0]
    return Math.floor((100*e-h) / (e-h)) / 100
}
module.exports = getCrashPoint()
