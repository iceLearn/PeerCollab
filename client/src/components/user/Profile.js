import React, { Component } from 'react'
import jwtDecode from 'jwt-decode'
import { Route, Link } from 'react-router-dom'

const User = ({ match }) => <p>{match.params.id}</p>

class Profile extends Component {
  constructor () {
    super()
    this.state = {
      name: '',
      username: '',
      state: '',
      email: ''
    }
  }
  componentDidMount () {
    const token = localStorage.usertoken
    const decoded = jwtDecode(token)
    this.setState({
      name: decoded.name,
      username: decoded.username,
      state: decoded.state,
      email: decoded.email
    })
  }
  render () {
    return (
      <div>
        <h1>Name: {this.state.name}</h1>
        <h1>Username: {this.state.username}</h1>
        <h1>State: {this.state.state}</h1>
        <h1>Email: {this.state.email}</h1>
      </div>
    )
  }
}

export default Profile
