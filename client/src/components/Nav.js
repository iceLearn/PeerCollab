import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { userInfo } from '../info'
import axios from './../ctrl/AxiosConf'

class Nav extends Component {

  constructor() {
    super()
    this.state = {
      notifications: []
    }
    this.loadNotifications()
  }

  loadNotifications() {
    axios.get('notifications/').then(res => {
      this.setState({
        notifications: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  clickLink = (url, e) => {
    e.preventDefault()
    this.props.history.push(url)
  }

  clickLogout = (e) => {
    e.preventDefault()
    this.setState({ anchorEl: null })
    localStorage.removeItem('usertoken')
    axios.post('users/logout').then(res => {
    }).catch(err => {
      console.log(err)
    })
    this.props.history.push('/login')
    window.location.reload()
  }

  formatDate(date) {
    return date.substring(0, 19).replace('T', ' ')
  }

  clickNotification = (index, id, link) => e => {
    this.props.history.push('/' + link)
    axios.put('notifications/', {
      id: id
    }).then(res => {
      let notifications = this.state.notifications
      notifications.splice(index, 1)
      this.setState({
        notifications: notifications
      })
    }).catch(err => {
      console.log(err)
    })
  }

  html = (formatDate, clickNotification) => (
    <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end">
      <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
        <span class="ti-view-list"></span>
      </button>
      {/* <ul class="navbar-nav mr-lg-2">
        <li class="nav-item nav-search d-none d-lg-block">
          <div class="input-group">
            <div class="input-group-prepend hover-cursor" id="navbar-search-icon">
              <span class="input-group-text" id="search">
                <i class="ti-search"></i>
              </span>
            </div>
            <input type="text" class="form-control" id="navbar-search-input" placeholder="Search now" aria-label="search" aria-describedby="search" />
          </div>
        </li>
      </ul> */}
      <ul class="navbar-nav navbar-nav-right">
        {/* <li class="nav-item dropdown mr-1">
          <a class="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" href="#" data-toggle="dropdown">
            <i class="ti-email mx-0"></i>
          </a>
          <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="messageDropdown">
            <p class="mb-0 font-weight-normal float-left dropdown-header">Messages</p>
            <a class="dropdown-item">
              <div class="item-thumbnail">
                <img src="images/faces/face4.jpg" alt="image" class="profile-pic" />
              </div>
              <div class="item-content flex-grow">
                <h6 class="ellipsis font-weight-normal">David Grey
          </h6>
                <p class="font-weight-light small-text text-muted mb-0">
                  The meeting is cancelled
          </p>
              </div>
            </a>
            <a class="dropdown-item">
              <div class="item-thumbnail">
                <img src="images/faces/face2.jpg" alt="image" class="profile-pic" />
              </div>
              <div class="item-content flex-grow">
                <h6 class="ellipsis font-weight-normal">Tim Cook
          </h6>
                <p class="font-weight-light small-text text-muted mb-0">
                  New product launch
          </p>
              </div>
            </a>
            <a class="dropdown-item">
              <div class="item-thumbnail">
                <img src="images/faces/face3.jpg" alt="image" class="profile-pic" />
              </div>
              <div class="item-content flex-grow">
                <h6 class="ellipsis font-weight-normal"> Johnson
          </h6>
                <p class="font-weight-light small-text text-muted mb-0">
                  Upcoming board meeting
          </p>
              </div>
            </a>
          </div>
        </li> */}
        <li class="nav-item dropdown">
          <a class="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-toggle="dropdown">
            <i class="ti-bell mx-0"></i>
            <span class="count" style={{ display: this.state.notifications.length > 0 ? '' : 'none' }}></span>
          </a>
          <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="notificationDropdown">
            <p class="mb-0 font-weight-normal float-left dropdown-header">Notifications</p>
            {
              this.state.notifications.map(function (val, index) {
                return <a class="dropdown-item" key={index} onClick={clickNotification(index, val.id, val.url)}>
                  <div class="item-thumbnail">
                    <div class="item-icon bg-success">
                      <i class="ti-info-alt mx-0"></i>
                    </div>
                  </div>
                  <div class="item-content">
                    <h6 class="font-weight-normal">{val.text}</h6>
                    <p class="font-weight-light small-text mb-0 text-muted">
                      {formatDate(val.created_at)}
                    </p>
                  </div>
                </a>
              })
            }
          </div>
        </li>
        <li class="nav-item nav-profile dropdown">
          <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
            <img src={'images/user_icons/' + (userInfo['icon'] != null ? userInfo['icon'] : 0) + '.jpg'} alt="profile" />
          </a>
          <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
            <a class="dropdown-item" href='#' onClick={this.clickLink.bind(this, '/')}>
              <i class="ti-layout text-primary"></i>
        Dashboard
      </a>
            <a class="dropdown-item" href='#' onClick={this.clickLink.bind(this, '/profile')}>
              <i class="ti-user text-primary"></i>
        Profile
      </a>
            {/* <a class="dropdown-item">
              <i class="ti-files text-primary"></i>
        Certificates
      </a>
            <a class="dropdown-item">
              <i class="ti-settings text-primary"></i>
        Settings
      </a> */}
            <a class="dropdown-item" href="#" onClick={this.clickLogout}>
              <i class="ti-power-off text-primary"></i>
        Logout
      </a>
          </div>
        </li>
      </ul>
      <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
        <span class="ti-view-list"></span>
      </button>
    </div>
  )
  render() {
    var html = this.html(this.formatDate, this.clickNotification)
    return (
      html
    )
  }
}

export default withRouter(Nav)
