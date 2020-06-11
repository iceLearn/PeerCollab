import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import axios from './ctrl/AxiosConf'
import { userInfo } from './info'
import jwtDecode from 'jwt-decode'

// set user info
const token = localStorage.usertoken
if (token) {
  const decoded = jwtDecode(token)
  userInfo['id'] = decoded.id
  axios.get('users/get-info').then(res => {
    userInfo['username'] = res.data.username
    userInfo['name'] = res.data.name
    userInfo['email'] = res.data.email
    userInfo['state'] = res.data.state
    userInfo['country'] = res.data.country
    userInfo['timezone'] = res.data.timezone
    userInfo['bio'] = res.data.bio
    userInfo['icon'] = res.data.icon
    console.log(userInfo['level'])
    ReactDOM.render(<App />, document.getElementById('root'))
    serviceWorker.unregister()
  }).catch(err => {
    console.log(err)
    ReactDOM.render(<App />, document.getElementById('root'))
    serviceWorker.unregister()
  })
} else {
  ReactDOM.render(<App />, document.getElementById('root'))
  serviceWorker.unregister()
}
