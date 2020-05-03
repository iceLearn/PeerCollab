
const UserLog = require('../models/user-log')
const { logger } = require('../util/error-utils')
const { logTypes } = require('../middleware/properties')

const LogType = {
  LOGIN: 'LOGIN',
  LOGIN_ATTEMPT: 'LOGIN_ATT',
  LOGOUT: 'LOGOUT',
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  INSERT_ATTEMPT: 'INSERT_ATT',
  UPDATE_ATTEMPT: 'UPDATE_ATT',
  DELETE_ATTEMPT: 'DELETE_ATT',
  SELECT_ALL: 'SELECT_ALL',
  SELECT_BY_ID: 'SELECT_BY_ID',
  SELECT_ALL_ATTEMPT: 'SELECT_ALL_ATT',
  SELECT_BY_ID_ATTEMPT: 'SELECT_BY_ID_ATT'
}

function log (req, logType, refId, ui, component, message) {
  UserLog.create({
    ref_id: refId,
    user_interface: ui,
    component: component,
    message: message,
    log_type_id: logTypes[logType],
    user_id: req.decoded.id,
    ip: req.workstation
  }).then(results => {

  }).catch(err => {
    console.log(err)
    logger.error(err)
  })
}

function logNoReq (userId, workstationId, logType, refId, ui, component, message) {
  UserLog.create({
    ref_id: refId,
    user_interface: ui,
    component: component,
    message: message,
    log_type_id: logTypes[logType],
    user_id: userId,
    ip: workstationId
  }).then(results => {

  }).catch(err => {
    console.log(err)
    logger.error(err)
  })
}

module.exports = { log, logNoReq, LogType }
