const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../models/user')
const Community = require('../models/community')
const ActivePeriod = require('../models/active-period')
const middleware = require('../middleware/auth-middleware')
const { checkError, logger, ErrorType } = require('../util/error-utils')
const { log, LogType } = require('../ctrl/user-logger')
const Message = require('../ctrl/alert-messages')
const Sequelize = require('sequelize')
const db = require('../database/db')
router.use(cors())
const UI = 'ACTIVE_PERIOD'

ActivePeriod.hasOne(Community, { foreignKey: 'id', sourceKey: 'community_id' })
ActivePeriod.hasOne(User, { foreignKey: 'id', sourceKey: 'user_id' })

router.get('/:id', middleware.checkToken, (req, res) => {
  ActivePeriod.findOne({
    attributes: ['id', 'time', 'created_at', 'updated_at'],
    where: { 'user_id': req.params.id }
  }).then(data => {
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
  })
})

router.post('/', middleware.checkToken, (req, res) => {
  req.body.user_id = req.decoded.id
  ActivePeriod.create(req.body).then(results => {
    res.json({ status: true, id: results.id })
    log(req, LogType.INSERT, results.id, UI, null, '')
  }).catch(err => {
    if (checkError(err, ErrorType.UNIQUE_NAME)) {
      res.json({ status: false, message: Message.MSG_NAME_EXISTS })
      log(req, LogType.INSERT_ATTEMPT, null, UI, null, 'name: ' + req.body.name)
    } else {
      res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
      logger.error(err)
      log(req, LogType.INSERT_ATTEMPT, null, UI, null, '')
    }
  })
})

router.put('/', middleware.checkToken, (req, res) => {
  ActivePeriod.update(
    { time: Sequelize.literal('time + 15') },
    { where: { id: req.body.id } }
  ).then(results => {
    res.json({ status: true })
    log(req, LogType.UPDATE, req.body.id, UI, null, '')
  }).catch(err => {
    if (checkError(err, ErrorType.UNIQUE_NAME)) {
      res.json({ status: false, message: Message.MSG_NAME_EXISTS })
      log(req, LogType.UPDATE_ATTEMPT, req.body.id, UI, null, 'name: ' + req.body.name)
    } else {
      res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
      logger.error(err)
      log(req, LogType.UPDATE_ATTEMPT, req.body.id, UI, null, '')
    }
  })
})

router.delete('/:id', middleware.checkToken, (req, res) => {
  ActivePeriod.destroy(
    { where: { id: req.params.id } }
  ).then(results => {
    if (results === 0) {
      res.json({ status: true, message: Message.MSG_ALREADY_DELETED })
      log(req, LogType.DELETE_ATTEMPT, req.params.id, UI, null, 'already')
    } else {
      res.json({ status: true })
      log(req, LogType.DELETE, req.params.id, UI, null, '')
    }
  }).catch(err => {
    if (checkError(err, ErrorType.FOREIGN_KEY)) {
      res.json({ status: false, message: Message.MSG_IN_USE })
      log(req, LogType.DELETE_ATTEMPT, req.params.id, UI, null, 'in use')
    } else {
      res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
      logger.error(err)
      log(req, LogType.DELETE_ATTEMPT, null, UI, null, '')
    }
  })
})

module.exports = router
