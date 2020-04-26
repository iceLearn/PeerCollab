const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../models/user')
const Community = require('../models/community')
const Activity = require('../models/activity')
const middleware = require('../middleware/auth-middleware')
const { checkError, logger, ErrorType } = require('../util/error-utils')
const { log, LogType } = require('../ctrl/user-logger')
const Message = require('../ctrl/alert-messages')
const db = require('../database/db')
router.use(cors())
const UI = 'ACTIVITY'

Activity.hasOne(Community, { foreignKey: 'id', sourceKey: 'community_id' })
Activity.hasOne(User, { foreignKey: 'id', sourceKey: 'user_id' })
Activity.hasMany(Activity, { as: 'sub_activities', foreignKey: 'activity_ref_id', sourceKey: 'id' })

router.get('/by-community/:id/:offset', middleware.checkToken, (req, res) => {
  Activity.findAll({
    attributes: ['id', 'type', 'text', 'attachment', 'expression', 'created_at', 'updated_at',
      'activity_ref_id'],
    where: { 'community_id': req.params.id },
    order: [
      ['updated_at', 'DESC']
    ],
    offset: req.params.offset,
    limit: 10,
    include: [
      {
        attributes: ['id', 'username', 'name'],
        model: User
      }
    ]
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
  })
})

router.get('/by-user/:id/:offset', middleware.checkToken, (req, res) => {
  Activity.findAll({
    attributes: ['id', 'type', 'text', 'attachment', 'expression', 'created_at', 'updated_at',
      'activity_ref_id'],
    where: { 'user_id': req.params.id },
    order: [
      ['updated_at', 'DESC']
    ],
    offset: req.params.offset,
    limit: 100,
    include: [
      {
        attributes: ['id', 'name'],
        model: Community
      }
    ]
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
  })
})

router.get('/:id', middleware.checkToken, (req, res) => {
  Activity.findOne({
    attributes: ['id', 'type', 'text', 'attachment', 'expression', 'created_at', 'updated_at',
      'activity_ref_id'],
    where: { 'user_id': req.params.id },
    order: [
      ['updated_at', 'DESC']
    ],
    offset: req.params.offset,
    limit: 100,
    include: [
      {
        attributes: ['id', 'name'],
        model: Community
      },
      {
        attributes: ['id', 'username', 'name'],
        model: User
      },
      {
        model: Activity,
        as: 'sub_activities',
        on: {
          item_id: db.sequelize.where(db.sequelize.col('activity.activity_ref_id'), '=', db.sequelize.col('sub_activities.id'))
        },
        attributes: []
      }
    ]
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
  Activity.create(req.body).then(results => {
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
  Activity.update(
    req.body,
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
  Activity.destroy(
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
