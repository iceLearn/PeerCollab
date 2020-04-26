import React from 'react'
import PropTypes from 'prop-types'
import { Avatar, Button, CssBaseline, FormControl, Input, InputLabel, Paper, TextField } from '@material-ui/core'
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import Texts from '../../Texts'
import { userInfo, serverUrl } from '../../info'
import Notifier, { openSnackbar } from '../small-components/Notifier'
import { saveInfo, savePassword, saveProfilePicture, savePreferences } from '../../ctrl/UserFunctions'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(6))]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3)
  },
  button: {
    margin: theme.spacing(1)
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  input: {
    display: 'none',
  }
})

class Account extends React.Component {
  constructor() {
    super()
    this.state = {
      name: userInfo['name'],
      username: userInfo['username'],
      pre_password: '',
      new_password: '',
      new_password2: '',
      email: userInfo['email'],
      file: serverUrl + 'user_images/' + userInfo.id + '.jpg',
      expanded: null
    }
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  savePanel1(e) {
    e.preventDefault()
    const user = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email
    }
    saveInfo(user).then(res => {
      if (res.status === true) {
        userInfo['name'] = this.state.name
        userInfo['username'] = this.state.username
        userInfo['email'] = this.state.email
        openSnackbar({ variant: 'success', message: Texts.MSG_SAVE_SUCCESS })
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.message] })
      }
    })
  }

  savePanel2(e) {
    e.preventDefault()
    if (this.state.pre_password == '' || this.state.new_password == '' || this.state.new_password2 == '') {
      openSnackbar({ variant: 'error', message: Texts.MSG_FILL_ALL })
    } else if (this.state.new_password === this.state.new_password2) {
      const user = {
        pre_password: this.state.pre_password,
        new_password: this.state.new_password
      }
      savePassword(user).then(res => {
        if (res.status === true) {
          openSnackbar({ variant: 'success', message: Texts.MSG_UPDATE_SUCCESS })
        } else {
          openSnackbar({ variant: 'error', message: Texts[res.message] })
        }
      })
    } else {
      openSnackbar({ variant: 'error', message: Texts.MSG_PASSWORD_MISMATCH })
    }
  }

  savePanel3(e) {
    e.preventDefault()
    this.setState({
      file: URL.createObjectURL(e.target.files[0])
    })
    saveProfilePicture(this.state.file).then(res => {
      if (res.status === true) {
        openSnackbar({ variant: 'success', message: Texts.MSG_UPLOAD_SUCCESS })
      } else {
        openSnackbar({ variant: 'error', message: res.message })
      }
    })
  }

  html = (classes) => (
    <main className={classes.main}>
      <CssBaseline />
      <Paper className={classes.paper}>
        <div className={classes.root}>
          <ExpansionPanel expanded={this.state.expanded === 'panel1'} onChange={this.handleChange('panel1')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{Texts.BASIC_USER_INFO}</Typography>
              <Typography className={classes.secondaryHeading}>{Texts.CHANGE_USER_INFO}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='name'>{Texts.NAME}</InputLabel>
                <Input id='name' name='name' autoComplete='name'
                  value={this.state.name} onChange={this.onChange} autoFocus />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='username'>{Texts.USERNAME}</InputLabel>
                <Input id='username' name='username' autoComplete='username'
                  value={this.state.username} onChange={this.onChange} />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='email'>{Texts.EMAIL}</InputLabel>
                <Input id='email' name='email' autoComplete='email'
                  value={this.state.email} onChange={this.onChange} />
              </FormControl>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleChange('panel1')}>{Texts.BT_CANCEL}</Button>
              <Button size="small" color="primary" onClick={this.savePanel1.bind(this)}>{Texts.BT_SAVE}</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
          <ExpansionPanel expanded={this.state.expanded === 'panel2'} onChange={this.handleChange('panel2')}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{Texts.SECURITY_INFO}</Typography>
              <Typography className={classes.secondaryHeading}>
                {Texts.CHANGE_PASSWORD}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='pre_password'>{Texts.CURRENT_PASSWORD}</InputLabel>
                <Input name='pre_password' type='password' id='pre_password' autoComplete='current-password'
                  value={this.state.pre_password} onChange={this.onChange} />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='new_password'>{Texts.NEW_PASSWORD}</InputLabel>
                <Input name='new_password' type='password' id='new_password'
                  value={this.state.new_password} onChange={this.onChange} />
              </FormControl>
              <FormControl margin='normal' required fullWidth>
                <InputLabel htmlFor='new_password2'>{Texts.REPEAT_PASSWORD}</InputLabel>
                <Input name='new_password2' type='password' id='new_password2'
                  value={this.state.new_password2} onChange={this.onChange} />
              </FormControl>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleChange('panel2')}>{Texts.BT_CANCEL}</Button>
              <Button size="small" color="primary" onClick={this.savePanel2.bind(this)}>{Texts.BT_SAVE}</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
          <ExpansionPanel expanded={this.state.expanded === 'panel3'} onChange={this.handleChange('panel3')} style={{ display: 'none' }}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{Texts.PROFILE_PICTURE}</Typography>
              <Typography className={classes.secondaryHeading}>
                {Texts.CHANGE_PROFILE_PICTURE}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <img src={this.state.file} width='50%'>
              </img>
              <input
                accept="image/*"
                className={classes.input}
                id="text-button-file"
                type="file"
                onChange={this.savePanel3.bind(this)}
              />
              <label htmlFor="text-button-file">
                <Button component="span" className={classes.button}>
                  {Texts.BT_UPLOAD}
                </Button>
              </label>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleChange('panel3')}>{Texts.BT_CLOSE}</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        </div>
      </Paper>
    </main>
  )
  render() {
    var html = this.html(this.props.classes)
    return (
      html
    )
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(Account)
