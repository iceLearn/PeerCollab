import React, { Component } from 'react'
import { register } from '../../ctrl/UserFunctions'
import RegisterComponent from './RegisterComponent'
import Notifier, { openSnackbar } from '../small-components/Notifier'
import Texts from '../../Texts'

class Register extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      username: '',
      password: '',
      country: ''
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.clickLogin = this.clickLogin.bind(this)
  }
  clickLogin(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()
    const user = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      country: this.state.country
    }
    register(user).then(res => {
      if (res.status === true) {
        this.props.history.push('/login')
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.error] })
      }
    })
  }
  render() {
    return (
      <React.Fragment>
        <RegisterComponent data={this} />
        <Notifier />
      </React.Fragment>
    )
  }
}

export default Register
