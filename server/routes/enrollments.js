const express = require('express')
const router = express.Router()
const cors = require('cors')
const User = require('../models/user')
const Community = require('../models/community')
const Course = require('../models/course')
const Enrollment = require('../models/enrollment')
const Activity = require('../models/activity')
const ActivePeriod = require('../models/active-period')
const middleware = require('../middleware/auth-middleware')
const { checkError, logger, ErrorType } = require('../util/error-utils')
const { log, LogType } = require('../ctrl/user-logger')
const Message = require('../ctrl/alert-messages')
const Sequelize = require('sequelize')
router.use(cors())
const UI = 'ENROLLMENT'

Community.hasOne(Course, { foreignKey: 'id', sourceKey: 'course_id' })
Enrollment.hasOne(Community, { foreignKey: 'id', sourceKey: 'community_id' })
Enrollment.hasOne(User, { foreignKey: 'id', sourceKey: 'user_id' })
Community.hasMany(Enrollment, { as: 'enrollments', foreignKey: 'community_id', sourceKey: 'id' })
Community.hasMany(Activity, { as: 'activities', foreignKey: 'community_id', sourceKey: 'id' })
Community.hasMany(ActivePeriod, { as: 'periods', foreignKey: 'community_id', sourceKey: 'id' })

router.get('/by-community/:id', middleware.checkToken, (req, res) => {
  Enrollment.findAll({
    attributes: ['id', 'level', 'time', 'state'],
    where: { 'community_id': req.params.id },
    include: [
      {
        attributes: ['id', 'username', 'name', 'level', 'icon'],
        model: User
      }
    ],
    order: [
      ['level', 'DESC']
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

router.get('/by-user/:id', middleware.checkToken, (req, res) => {
  Enrollment.findAll({
    attributes: ['id', 'level', 'time', 'state'],
    where: { 'user_id': req.params.id },
    include: [
      {
        attributes: ['id', 'name'],
        model: Community,
        include: [
          {
            attributes: ['id', 'name', 'icon'],
            model: Course
          }
        ]
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

router.get('/my-communities', middleware.checkToken, (req, res) => {
  Enrollment.findAll({
    attributes: ['id', 'level', 'time', 'state',
      [Sequelize.literal('(SELECT COUNT(e.id) FROM enrollment e WHERE e.community_id = community.id)'), 'enrollments'],
      [Sequelize.literal('(SELECT COUNT(a.id) FROM activity a WHERE a.community_id = community.id AND a.type=\'POST\')'), 'activities'],
      [Sequelize.literal('(SELECT SUM(ap.time) FROM active_period ap WHERE ap.community_id = community.id AND ap.user_id=' + req.decoded.id + ')'), 'time']],
    where: { 'user_id': req.decoded.id },
    include: [
      {
        attributes: ['id', 'name'],
        model: Community,
        include: [
          {
            attributes: ['id', 'name', 'icon'],
            model: Course
          }
        ]
      }
    ],
    group: ['id']
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    console.log(err)
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
  })
})

router.get('/enrollment/:id', middleware.checkToken, (req, res) => {
  Enrollment.findAll({
    attributes: ['id', 'level', 'time', 'state'],
    where: {
      'user_id': req.decoded.id,
      'community_id': req.params.id
    }
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    console.log(err)
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
  })
})

router.post('/', middleware.checkToken, (req, res) => {
  req.body.user_id = req.decoded.id
  Enrollment.create(req.body).then(results => {
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
  Enrollment.update(
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
  Enrollment.destroy(
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
