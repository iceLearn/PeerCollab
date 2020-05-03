const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const cors = require('cors')
const User = require('../models/user')
const middleware = require('../middleware/auth-middleware')
const { checkError, logger, ErrorType } = require('../util/error-utils')
const { log, LogType } = require('../ctrl/user-logger')
const Message = require('../ctrl/alert-messages')
router.use(cors())
const UI = 'USER_MASTER'
const Op = Sequelize.Op

router.get('/', middleware.checkToken, (req, res) => {
  User.findAll({
    attributes: ['id', 'name', 'email', 'username', 'state', 'created_at'],
    order: [
      ['state', 'ASC'],
      ['name', 'ASC']
    ]
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
    logger.error(err)
  })
})

router.get('/:query', middleware.checkToken, (req, res) => {
  User.findAll({
    attributes: ['id', 'name', 'username', 'email', 'state', 'created_at'],
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: req.params.query + '%'
          }
        },
        {
          state: {
            [Op.like]: req.params.query
          }
        }
      ]
    },
    order: [
      ['state', 'ASC'],
      ['name', 'ASC']
    ]
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    res.json(data)
    log(req, LogType.SELECT_ALL, null, UI, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    log(req, LogType.SELECT_ALL_ATTEMPT, null, UI, null, '')
    logger.error(err)
  })
})

router.put('/', middleware.checkToken, (req, res) => {
  User.update(
    req.body,
    { where: { id: req.body.id } }
  ).then(results => {
    res.json({ status: true })
    log(req, LogType.UPDATE, null, UI, null, '')
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
    log(req, LogType.UPDATE_ATTEMPT, req.body.id, UI, null, '')
  })
})

module.exports = router
