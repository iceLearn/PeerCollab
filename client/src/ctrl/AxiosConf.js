import axios from 'axios'

axios.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.usertoken}` }
axios.defaults.baseURL = '/'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default axios
