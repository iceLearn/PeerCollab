import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

import Landing from './Landing'
import Nav from './Nav'
import Sidebar from './Sidebar'
import Login from './auth/Login'
import Register from './auth/Register'
import Notifier, { openSnackbar } from './small-components/Notifier'
import axios from './../ctrl/AxiosConf'
import Profile from './pages/Profile'
import Courses from './pages/Courses'
import CourseManager from './pages/CourseManager'
import CommunityManager from './pages/CommunityManager'
import MyCommunities from './pages/MyCommunities'
import Community from './pages/Community'
import User from './pages/User'
import { login } from '../ctrl/UserFunctions'

class MainWindow extends React.Component {

  NonAuth = (classes) => (
    <Router>
      <div class="container-scroller">
        <div class="container-fluid page-body-wrapper full-page-wrapper">
          <div class="content-wrapper d-flex align-items-center auth px-0">
            <div class="row w-100 mx-0">
              <div class="col-lg-4 mx-auto">
                <Route exact path='/' component={Login} />
                <Route exact path='/register' component={Register} />
                <Route exact path='/login' component={Login} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notifier />
    </Router>
  )

  Auth = (classes) => (
    <div>
      <Router>
        <div class="container-scroller">
          <nav class="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
            <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
              <a class="navbar-brand brand-logo mr-5" href="/"><img src="images/logo.svg" class="mr-2" alt="logo" /></a>
              <a class="navbar-brand brand-logo-mini" href="/"><img src="images/logo-mini.svg" alt="logo" /></a>
            </div>
            <Nav />
          </nav>
          <div class="container-fluid page-body-wrapper">
            <Sidebar />
            <div class="main-panel">
              <Route exact path='/' component={Landing} />
              <Route exact path='/profile' component={Profile} />
              <Route exact path='/course-manager' component={CourseManager} />
              <Route exact path='/community-manager' component={CommunityManager} />
              <Route exact path='/community-browser' component={Courses} />
              <Route exact path='/my-communities' component={MyCommunities} />
              <Route exact path='/community/:id' component={Community} />
              <Route exact path='/user/:id' component={User} />
              {/* <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} />
              <Route exact path='/' component={Landing} /> */}
              <footer class="footer">
                <div class="d-sm-flex justify-content-center justify-content-sm-between">
                  <span class="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2020 <a href="#" target="_blank">PeerCollab</a>. All rights reserved.</span>
                </div>
              </footer>
            </div>
          </div>
        </div>
        <Notifier />
      </Router>
    </div>
  )

  render() {
    const { classes } = this.props
    var html = this.NonAuth(this.props.classes)
    if (localStorage.usertoken) {
      try {
        const decoded = jwtDecode(localStorage.usertoken)
        const user = {
          username: decoded.username,
          password: decoded.password
        }
        // console.log(user)
        // login(user).then(res => {
        //   if (res.error || res.warning) {
        //     console.log(res.error)
        //     console.log(res.warning)
        //     localStorage.removeItem('usertoken')
        //     axios.post('users/logout').then(res => {
        //     }).catch(err => {
        //       console.log(err)
        //     })
        //     // window.location.reload()
        //   } else {
        //   }
        // })
        html = this.Auth(this.props.classes)
      } catch (error) {
        console.log(error)
      }
    }
    return (
      html
    )
  }
}

export default MainWindow
