let jwt = require('jsonwebtoken')
const { workstations } = require('./properties')
const Message = require('../ctrl/alert-messages')

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; 
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          status: false,
          message: Message.MSG_SESSION_EXPIRED
        })
      } else {
        req.decoded = decoded
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        ip = ip.replace('::ffff:','')
        req.workstation = workstations[ip]
        next()
      }
    })
  } else {
    return res.json({
      status: false,
      message: Message.MSG_NOT_LOGGED_IN
    })
  }
}

module.exports = {
  checkToken: checkToken
}