import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class Nav extends Component {

  clickLink = (url, e) => {
    e.preventDefault()
    this.props.history.push(url)
  }

  html = (classes) => (
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" href='#' onClick={this.clickLink.bind(this, '/')}>
            <i class="ti-shield menu-icon"></i>
            <span class="menu-title">Dashboard</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
            <i class="ti-user menu-icon"></i>
            <span class="menu-title">User Pages</span>
            <i class="menu-arrow"></i>
          </a>
          <div class="collapse" id="auth">
            <ul class="nav flex-column sub-menu">
              <li class="nav-item"> <a class="nav-link" href='#' onClick={this.clickLink.bind(this, '/courses')}> Courses </a></li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  )
  render() {
    var html = this.html(this.props.classes)
    return (
      html
    )
  }
}

export default withRouter(Nav)
