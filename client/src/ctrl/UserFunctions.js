import axios from './AxiosConf'
import FormData from 'form-data'

export const register = newUser => {
  return axios.post('users/register', {
    email: newUser.email,
    username: newUser.username,
    password: newUser.password,
    country: newUser.country
  }).then(res => {
    return res.data
  }).catch(err => {
    console.log(err)
  })
}

export const saveInfo = user => {
  return axios.post('users/save-info', {
    name: user.name,
    username: user.username
  }).then(res => {
    return res.data
  }).catch(err => {
    console.log(err)
  })
}

export const savePassword = user => {
  return axios.post('users/save-password', {
    pre_password: user.pre_password,
    new_password: user.new_password
  }).then(res => {
    return res.data
  }).catch(err => {
    console.log(err)
  })
}

export const saveProfilePicture = file => {
  let data = new FormData();
  data.append('file', file, file.fileName);
  return axios.post('users/save-profile-picture', data, {
    headers: {
      'accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    }
  }).then((res) => {
    return res.data
  }).catch((err) => {
    console.log(err)
  })
}

export const savePreferences = user => {
  return axios.post('users/save-preferences', {

  }).then(res => {
    return res.data
  }).catch(err => {
    console.log(err)
  })
}

export const login = user => {
  return axios.post('users/login', {
    username: user.username,
    password: user.password
  }).then(res => {
    localStorage.setItem('usertoken', res.data)
    return res.data
  }).catch(err => {
    console.log(err)
  })
}
