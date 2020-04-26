const log4js = require('log4js')
log4js.configure({
  appenders: { error_log: { type: 'file', filename: 'error_log.log' } },
  categories: { default: { appenders: ['error_log'], level: 'error' } }
})
const logger = log4js.getLogger('error_log')

const ErrorType = {
  FOREIGN_KEY: 'ForeignKeyConstraintError',
  UNIQUE_NAME: 'name_UNIQUE',
  UNIQUE_CODE: 'code_UNIQUE',
  UNIQUE_BARCODE: 'barcode_UNIQUE',
  UNIQUE_TELEPHONE: 'telephone_UNIQUE',
  UNIQUE_EMAIL: 'email_UNIQUE',
  UNIQUE_USERNAME: 'username_UNIQUE',
  MINUS: 'DATA_OUT_OF_RANGE'
}

function checkError (err, str) {
  return JSON.stringify(err).indexOf((str)) > -1
}

module.exports = { checkError, logger, ErrorType }
