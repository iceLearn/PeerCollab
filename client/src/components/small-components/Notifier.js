import React from 'react'
import CustomizedSnackbars from './SimpleSnackBar'

let openSnackbarFn

class Notifier extends React.Component {
  state = {
    open: false,
    variant: 'info',
    message: ''
  }

  componentDidMount () {
    openSnackbarFn = this.openSnackbar;
  }

  openSnackbar = ({ variant, message }) => {
    this.setState({
      open: true,
      variant,
      message
    })
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  render () {
    return (
      <CustomizedSnackbars data={this} />
    )
  }
}

export function openSnackbar ({ variant, message }) {
  openSnackbarFn({ variant, message })
}

export default Notifier