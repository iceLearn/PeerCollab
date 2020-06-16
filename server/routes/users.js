const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const multer = require('multer')
const User = require('../models/user')
const middleware = require('../middleware/auth-middleware');
const { checkError, logger, ErrorType } = require('../util/error-utils')
const { log, logNoReq, LogType } = require('../ctrl/user-logger')
const Message = require('../ctrl/alert-messages')
const { makeId } = require('../ctrl/math')
const { info } = require('../middleware/properties')
const http = require('http')
users.use(cors())
const UI = 'LOGIN_REGISTER'
const UI2 = 'USER_ACCOUNT'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/images/user_icons')
  },
  filename: function (req, file, cb) {
    let id = makeId(16)
    User.update(
      {
        icon: id
      },
      { where: { id: req.decoded.id } }
    ).then(rows => {
      log(req, LogType.UPDATE, null, UI2, 'user image', '')
    }).catch(err => {
      console.log(err)
    })
    cb(null, id + '.jpg')
  }
})

const upload = multer({ storage: storage }).single('file')

users.get('/get-info', middleware.checkToken, (req, res) => {
  User.findOne(
    { where: { id: req.decoded.id } }
  ).then(user => {
    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      state: user.state,
      country: user.country,
      timezone: user.timezone,
      bio: user.bio,
      icon: user.icon
    })
    log(req, LogType.SELECT_BY_ID, null, UI2, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_BY_ID_ATTEMPT, null, UI2, null, '')
  })
})

users.post('/register', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  var workstation = ip
  var state = 'VERIFIED'
  User.max('id').then(function (maxId) {
    // state = isNaN(maxId) ? 'VERIFIED' : 'NEW'
    const userData = {
      'email': req.body.email,
      'username': req.body.username,
      'name': req.body.username,
      'password': req.body.password,
      'country': req.body.country,
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
})

users.post('/login', (req, res) => {
  var workstation = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      let hash = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.password).digest('hex')
      if (hash === user.password) {
        switch (user.state) {
          case 'NEW':
            res.json({ warning: Message.MSG_ACCOUNT_UNVERIFIED })
            logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'unverified')
            break
          case 'BLOCKED':
            res.json({ warning: Message.MSG_ACCOUNT_BLOCKED })
            logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'blocked')
            break
          case 'DISABLED':
            res.json({ warning: Message.MSG_ACCOUNT_DISABLED })
            logNoReq(user.id, workstation, LogType.LOGIN_ATTEMPT, null, UI, 'login', 'disabled')
            break
          case 'VERIFIED':
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 8640000
            })
            res.send(token)
            logNoReq(user.id, workstation, LogType.LOGIN, null, UI, 'login', '')
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
      country: req.body.country,
      timezone: req.body.timezone,
      bio: req.body.bio
    },
    { where: { id: req.decoded.id } }
  ).then(rows => {
    res.json({ status: true })
    log(req, LogType.INSERT, null, UI2, 'info', '')
  }).catch(err => {
    console.log(err)
    if (checkError(err, ErrorType.UNIQUE_USERNAME)) {
      res.json({ status: false, message: Message.MSG_USERNAME_EXISTS })
      log(req, LogType.INSERT_ATTEMPT, null, UI2, 'info', 'username: ' + req.body.username)
    } else if (checkError(err, ErrorType.UNIQUE_EMAIL)) {
      res.json({ status: false, message: Message.MSG_EMAIL_EXISTS })
      log(req, LogType.INSERT_ATTEMPT, null, UI2, 'info', 'email: ' + req.body.email)
    } else {
      res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
      log(req, LogType.INSERT_ATTEMPT, null, UI2, 'info', '')
      logger.error(err)
    }
  })
})

users.post('/save-password', middleware.checkToken, (req, res) => {
  let pre_password = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.pre_password).digest('hex')
  User.findOne(
    { where: { id: req.decoded.id } }
  ).then(user => {
    if (pre_password === user.password) {
      let new_password = crypto.createHmac('sha256', process.env.SECRET_KEY).update(req.body.new_password).digest('hex')
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

users.post('/upload-image', middleware.checkToken, function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send({ id: res.req.file.filename.split('.')[0] })
  })
})

module.exports = users
