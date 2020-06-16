
const LogType = require('../models/log-type')
const Info = require('../models/info')
const { logger } = require('../util/error-utils')

let logTypes = []
let info = []

function loadLogTypes() {
  LogType.findAll({
    attributes: ['id', 'code']
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    data.map((item) => {
      logTypes[item.code] = item.id
    })
  }).catch(err => {
    logger.error(err)
  })
}

function loadInfo() {
  Info.findAll({
    attributes: ['key', 'value']
  }).then(results => {
    const data = results.map((node) => node.get({ plain: true }))
    data.map((item) => {
      info[item.key] = item.value
    })
  }).catch(err => {
    logger.error(err)
  })
}

module.exports = {
  logTypes, info, loadLogTypes, loadInfo
}
