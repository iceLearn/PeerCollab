import React, { Component } from 'react'
import { login } from '../../ctrl/UserFunctions'
import LoginComponent from './LoginComponent'
import Notifier, { openSnackbar } from '../small-components/Notifier'
import Texts from '../../Texts'
import { userInfo } from '../../info'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.clickRegister = this.clickRegister.bind(this)
  }
  clickRegister(e) {
    e.preventDefault()
    this.props.history.push('/register')
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()
    const user = {
      username: this.state.username,
      password: this.state.password
    }
    login(user).then(res => {
      if (res.error) {
        openSnackbar({ variant: 'error', message: Texts[res.error] })
      } else if (res.warning) {
        openSnackbar({ variant: 'warning', message: Texts[res.warning] })
      } else {
        userInfo['username'] = this.state.username
        this.props.history.push('/')
        window.location.reload()
      }
    })
  }
  render() {
    return (
      <React.Fragment>
        <LoginComponent data={this} />
        <Notifier />
      </React.Fragment>
    )
  }
}

export default Login
