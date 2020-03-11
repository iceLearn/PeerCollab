const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const multer = require("multer")
const User = require('../models/user')
const middleware = require('../middleware/auth-middleware');
const { checkError, logger, ErrorType } = require('../util/error-utils')
const Message = require('../ctrl/alert-messages')
const { workstations, info } = require('../middleware/properties')
const http = require('http')
users.use(cors())
const UI = 'LOGIN_REGISTER'
const UI2 = 'USER_ACCOUNT'

users.post('/register', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  var workstation = workstations[ip]
  if (req.body.birthday) {
    var level = 'USER'
    var state = 'NEW'
    User.max('id').then(function (maxId) {
      level = isNaN(maxId) ? 'ADMIN' : 'USER'
      state = isNaN(maxId) ? 'VERIFIED' : 'NEW'
      const userData = {
        'name': req.body.name,
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email,
        'level': level,
        'state': state
      }
      User.findOne({
        where: {
          username: req.body.username
        }
      }).then(user => {
        if (!user) {
          userData.password = crypto.createHmac('sha256', process.env.SECRET_KEY).update(userData.password).digest('hex')
          User.create(userData).then(user => {
            res.json({ status: true })
            logNoReq(null, workstation, LogType.INSERT, null, UI, 'register', 'user: ' + userData.username)
          }).catch(err => {
            res.json({ error: Message.MSG_UNKNOWN_ERROR })
            logger.error(err)
            logNoReq(null, workstation, LogType.INSERT_ATTEMPT, null, UI, 'register', 'user: ' + userData.username)
          })
        } else {
          res.json({ error: Message.MSG_USERNAME_EXISTS })
          logNoReq(null, workstation, LogType.INSERT_ATTEMPT, null, UI, 'register', 'username: ' + userData.username)
        }
      }).catch(err => {
        res.json({ error: Message.MSG_UNKNOWN_ERROR })
        logger.error(err)
        logNoReq(null, workstation, LogType.INSERT_ATTEMPT, null, UI, 'register', '')
      })
    })
  } else {
    res.json({ error: Message.MSG_INVALID_DATE })
    logNoReq(null, workstation, LogType.INSERT_ATTEMPT, null, UI, 'register', 'date: ' + req.body.birthday)
  }
})

users.post('/login', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  var workstation = workstations[ip]
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      let hash = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.password).digest('hex')
      if (hash === user.password) {
        switch (user.state) {
          case 'NEW': {
            res.json({ warning: Message.MSG_ACCOUNT_UNVERIFIED })
            logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'unverified')
          }
            break
          case 'BLOCKED': {
            res.json({ warning: Message.MSG_ACCOUNT_BLOCKED })
            logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'blocked')
          }
            break
          case 'DISABLED': {
            res.json({ warning: Message.MSG_ACCOUNT_DISABLED })
            logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'disabled')
          }
            break
          case 'VERIFIED': {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 8640000
            })
            res.send(token)
            logNoReq(user.id, workstation, LogType.LOGIN, null, UI, 'login', '')
          }
            break
        }
      } else {
        res.json({ error: Message.MSG_PASSWORD_INCORRECT })
        logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'password: ' + req.body.password)
      }
    } else {
      res.json({ error: Message.MSG_NO_USER })
      logNoReq(null, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'no_user: ' + req.body.username)
    }
  }).catch(err => {
    res.json({ error: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    logNoReq(null, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', '')
  })
})

users.post('/check-password', middleware.checkToken, (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      let hash = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.password).digest('hex')
      if (hash === user.password) {
        res.json({ status: true })
      } else {
        res.json({ error: Message.MSG_PASSWORD_INCORRECT })
      }
    } else {
      res.json({ error: Message.MSG_NO_USER })
    }
  }).catch(err => {
    console.log(err)
    res.json({ error: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
  })
})

users.post('/logout', middleware.checkToken, (req, res) => {
  log(req, LogType.LOGOUT, null, null, null, '')
})

users.post('/save-info', middleware.checkToken, (req, res) => {
  User.update(
    {
      name: req.body.name,
      username: req.body.username
    },
    { where: { id: req.decoded.id } }
  ).then(rows => {
    res.json({ status: true })
    log(req, LogType.INSERT, null, UI2, 'info', '')
  }).catch(err => {
    if (checkError(err, ErrorType.UNIQUE_USERNAME)) {
      res.json({ status: false, message: Message.MSG_USERNAME_EXISTS })
      log(req, LogType.INSERT_ATTEMPT, null, UI2, 'info', 'username: ' + req.body.username)
    } else {
      res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
      log(req, LogType.INSERT_ATTEMPT, null, UI2, 'info', '')
      logger.error(err)
    }
  })
})

users.post('/save-password', middleware.checkToken, (req, res) => {
  pre_password = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.pre_password).digest('hex')
  User.findOne(
    { where: { id: req.decoded.id } }
  ).then(user => {
    if (pre_password === user.password) {
      new_password = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.new_password).digest('hex')
      User.update(
        {
          password: new_password
        },
        { where: { id: req.decoded.id } }
      ).then(rows => {
        res.json({ status: true })
        log(req, LogType.UPDATE, null, UI2, 'password', '')
      }).catch(err => {
        res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
        logger.error(err)
        log(req, LogType.UPDATE_ATTEMPT, null, UI2, 'password', '')
      })
    } else {
      res.json({ status: false, message: Message.MSG_INCORRECT_PRE_PASSWORD })
      log(req, LogType.UPDATE_ATTEMPT, null, UI2, 'password', 'incorrect')
    }
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.UPDATE_ATTEMPT, null, UI2, 'password', '')
  })
})

users.get('/get-info', middleware.checkToken, (req, res) => {
  User.findOne(
    { where: { id: req.decoded.id } }
  ).then(user => {
    res.json({
      name: user.name,
      username: user.username,
      state: user.state,
      level: user.level
    })
    log(req, LogType.SELECT_BY_ID, null, UI2, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_BY_ID_ATTEMPT, null, UI2, null, '')
  })
})

const upload = multer({
  dest: "./user_images"
})

users.post("/save-profile-picture", middleware.checkToken,
  upload.single("file"),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./user-images/" + req.decoded.id + ".jpg");
    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      fs.rename(tempPath, targetPath, err => {
        if (err) {
          res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
          logger.error(err)
          log(req, LogType.INSERT_ATTEMPT, null, UI2, 'picture', '')
        }
        res.json({ status: true, message: Message.MSG_UPLOAD_SUCCESS })
        log(req, LogType.INSERT, null, UI2, 'picture', '')
      })
    } else {
      fs.unlink(tempPath, err => {
        if (err) {
          res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
          logger.error(err)
          log(req, LogType.INSERT_ATTEMPT, null, UI2, 'picture', '')
        }
        res.json({ status: false, message: Message.MSG_ONLY_JPG })
        log(req, LogType.INSERT_ATTEMPT, null, UI2, 'picture', 'jpg')
      })
    }
  }
)

module.exports = users
