var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const dotenv = require('dotenv');
dotenv.config();
const connectHistoryApiFallback = require('connect-history-api-fallback')
const { loadWorkstations, loadInfo, loadPrivileges, loadLogTypes, loadTransactionTypes,
  loadLastStockTaking } = require('./middleware/properties')

var app = express()
var port = process.env.PORT || 5000
process.env.SECRET_KEY = 'secret'

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

var users = require('./routes/users')
app.use('/users', users)
var userMaster = require('./routes/user-master')
app.use('/user-master', userMaster)

app.use(connectHistoryApiFallback({
  verbose: false
}))

app.use(express.static('static'))

app.listen(port, () => {
  console.log('Server is running on port: ' + port)
})
