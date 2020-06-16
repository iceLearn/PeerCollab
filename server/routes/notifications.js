const express = require('express')
const router = express.Router()
const cors = require('cors')
const { getActiveNotifications, clickNotification } = require('../ctrl/notification-ctrl')
const middleware = require('../middleware/auth-middleware')
router.use(cors())

router.get('/', middleware.checkToken, (req, res) => {
  getActiveNotifications(req.decoded.id).then(data => {
    res.json(data)
  }).catch(err => {
    console.log(err)
  })
})

router.put('/', middleware.checkToken, (req, res) => {
  clickNotification(req.body.id).then(data => {
    res.json({ status: true })
  }).catch(err => {
    console.log(err)
  })
})

module.exports = router
