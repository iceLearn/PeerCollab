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
          <a class="nav-link" href='#' onClick={this.clickLink.bind(this, '/course-manager')}>
            <i class="ti-file menu-icon"></i>
            <span class="menu-title">Course Manager</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href='#' onClick={this.clickLink.bind(this, '/community-manager')}>
            <i class="ti-files menu-icon"></i>
            <span class="menu-title">Community Manager </span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href='#' onClick={this.clickLink.bind(this, '/community-browser')}>
            <i class="ti-search menu-icon"></i>
            <span class="menu-title">Browse Communities</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href='#' onClick={this.clickLink.bind(this, '/my-communities')}>
            <i class="ti-pin-alt menu-icon"></i>
            <span class="menu-title">My Communities</span>
          </a>
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
