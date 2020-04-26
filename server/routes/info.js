const express = require('express')
const router = express.Router()
const cors = require('cors')

const Info = require('../models/info')
const { logger } = require('../util/error-utils')
const Message = require('../ctrl/alert-messages')
router.use(cors())

router.get('/get-info', (req, res) => {
  Info.findAll().then(info => {
    const data = info.map((node) => node.get({ plain: true }))
    res.json(data)
  }).catch(err => {
    res.json({ status: false, message: Message.MSG_UNKNOWN_ERROR })
    logger.error(err)
  })
})

module.exports = router
