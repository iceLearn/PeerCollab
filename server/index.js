var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const dotenv = require('dotenv')

const connectHistoryApiFallback = require('connect-history-api-fallback')
const { loadInfo, loadLogTypes } = require('./middleware/properties')

dotenv.config()

var app = express()
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

var users = require('./routes/users')
app.use('/users', users)
var userMaster = require('./routes/user-master')
app.use('/user-master', userMaster)
var info = require('./routes/info')
app.use('/info', info)
var courses = require('./routes/courses')
app.use('/courses', courses)
var communities = require('./routes/communities')
app.use('/communities', communities)
var enrollments = require('./routes/enrollments')
app.use('/enrollments', enrollments)
var activities = require('./routes/activities')
app.use('/activities', activities)

app.use(connectHistoryApiFallback({
  verbose: false
}))

app.use(express.static('static'))

loadInfo()
loadLogTypes()

app.listen(port, () => {
  console.log('Server is running on port: ' + port)
})
