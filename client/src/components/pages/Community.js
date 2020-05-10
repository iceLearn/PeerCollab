import React, { Component } from 'react'
import { userInfo } from '../../info'
import axios from '../../ctrl/AxiosConf'
import Texts from '../../Texts'
import Notifier, { openSnackbar } from '../small-components/Notifier'

const url = 'communities'

class Community extends Component {

  constructor() {
    super()
    this.state = {
      id: 0,
      data: {},
      enrolled: false,
      enrollment: [],
      posts: [],
      users: [],
      text: ''
    }
  }

  componentDidMount() {
    this.setState({
      id: this.props.match.params.id,
      data: {},
      enrolled: false,
      enrollment: [],
      posts: [],
      users: [],
      text: ''
    }, () => {
      console.log(this.state.data)
      this.checkEnrollment()
      this.loadCommunity()
    })
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps
    this.componentDidMount()
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  // viewCommunities = (index) => e => {
  //   this.setState({
  //     courseId: this.state.courses[index].id
  //   }, () => {
  //     this.loadData()
  //   })
  // }

  loadCommunity() {
    axios.get(url + '/' + this.state.id).then(res => {
      this.setState({
        data: res.data !== null ? res.data : {}
      })
    }).catch(err => {
      console.log(err)
    })
  }

  loadPosts() {
    axios.get('activities/by-community/' + this.state.id + '/0').then(res => {
      let posts = []
      console.log(res.data)
      res.data.map(item => {
        item.commenting = false
        item.current_comment = ''
        item.comments = []
        item.likes = 0
        item.liked = false
        item.likeId = 0
        item.sub_activities.map(subActivity => {
          if (subActivity.type === 'COMMENT') {
            item.comments.push(subActivity)
          } else if (subActivity.type === 'EXPRESSION') {
            item.likes = item.likes + 1
            if (subActivity.sub_user.id == userInfo['id']) {
              item.liked = true
              item.likeId = subActivity.id
            }
          }
        })
        posts.push(item)
      })
      this.setState({
        posts: posts
      })
    }).catch(err => {
      console.log(err)
    })
  }

  checkEnrollment() {
    axios.get('enrollments/enrollment/' + this.state.id).then(res => {
      if (res.data.length > 0) {
        this.setState({
          enrolled: true,
          enrollment: res.data[0]
        })
        axios.get('enrollments/by-community/' + this.state.id).then(res => {
          if (res.data.length > 0) {
            this.setState({
              users: res.data
            })
          }
        }).catch(err => {
          console.log(err)
        })
        this.loadPosts()
      } else {
        this.setState({
          enrolled: false,
          enrollment: [],
          posts: [],
          users: []
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  enroll = (e) => {
    e.preventDefault()
    axios.post('enrollments', { 'community_id': this.state.id }).then(res => {
      if (res.data.status === true) {
        openSnackbar({ variant: 'success', message: Texts.MSG_SAVE_SUCCESS })
        this.loadCommunity()
        this.checkEnrollment()
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.data.message] })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  post = (e) => {
    e.preventDefault()
    axios.post('activities', {
      'text': this.state.text,
      'community_id': this.state.id
    }).then(res => {
      if (res.data.status === true) {
        this.loadPosts()
        this.setState({
          text: ''
        })
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.data.message] })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  comment = (index) => e => {
    e.preventDefault()
    axios.post('activities', {
      'text': this.state.posts[index].current_comment,
      'community_id': this.state.id,
      'type': 'COMMENT',
      'activity_ref_id': this.state.posts[index].id
    }).then(res => {
      if (res.data.status === true) {
        // this.state.posts[index].current_comment = ''
        // this.state.posts[index].commenting = false
        // this.setState({
        //   posts: this.state.posts
        // })
        this.loadPosts()
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.data.message] })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  like = (index) => e => {
    e.preventDefault()
    if (this.state.posts[index].liked) {
      axios.delete('activities/' + this.state.posts[index].likeId).then(res => {
        if (res.data.status === true) {
          this.loadPosts()
        } else {
          openSnackbar({ variant: 'error', message: Texts[res.data.message] })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      axios.post('activities', {
        'community_id': this.state.id,
        'type': 'EXPRESSION',
        'expression': 'LIKE',
        'activity_ref_id': this.state.posts[index].id
      }).then(res => {
        if (res.data.status === true) {
          this.loadPosts()
        } else {
          openSnackbar({ variant: 'error', message: Texts[res.data.message] })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  viewCommentField = (index) => e => {
    e.preventDefault()
    this.state.posts[index].commenting = !this.state.posts[index].commenting
    this.setState({
      posts: this.state.posts
    })
  }

  addComment = (index) => e => {
    e.preventDefault()
    this.state.posts[index].current_comment = e.target.value
    this.setState({
      posts: this.state.posts
    })
  }

  formatDate(date) {
    return date.substring(0, 19).replace('T', ' ')
  }

  html = (formatDate, comment, viewCommentField, addComment, like) => (
    <div>
      <div class="content-wrapper" style={{ display: !this.state.enrolled ? '' : 'none' }}>
        <div class="row">
          <div class="col-md-3 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <p class="card-title text-md-center text-xl-left">Course Name</p>
                <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                  <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">{this.state.data.hasOwnProperty('course') ? this.state.data.course.name : ''}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <p class="card-title text-md-center text-xl-left">Community Name</p>
                <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                  <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">{this.state.data.hasOwnProperty('name') ? this.state.data.name : ''}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <p class="card-title text-md-center text-xl-left">Description</p>
                <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                  <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">{this.state.data.hasOwnProperty('description') ? this.state.data.description : ''}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 grid-margin">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">Join {this.state.data.hasOwnProperty('name') ? this.state.data.name : ''} </h4>
                <form class="form-sample">
                  <p class="card-description"></p>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <p>Sample agreement</p>
                      </div>
                      <div class="form-group">
                        <div class="form-check form-check-flat form-check-primary">
                          <label class="form-check-label">
                            <input type="checkbox" class="form-check-input" />Yes I understand<i class="input-helper" ></i></label>
                        </div>
                        <button type="submit" class="btn btn-primary" onClick={this.enroll}>Join community</button>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">

                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-wrapper" style={{ display: this.state.enrolled ? '' : 'none' }}>
        <div class="row">
          <div class="col-md-9 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">{this.state.data.hasOwnProperty('name') ? this.state.data.name : ''}</h4>
                <form class="forms-sample">
                  <div class="form-group">
                    <label for="text">Write something</label>
                    <textarea class="form-control" id="text" name="text" rows="4" value={this.state.text} onChange={this.onChange}></textarea>
                  </div>
                  <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                    <button type="button" class="file-upload-browse btn btn-link">
                      <i class="ti-upload"></i> Photo/Video
                      </button>
                    <button type="button" class="btn btn-link">
                      <i class="ti-tag"></i> Tag members
                      </button>
                    <button type="submit" class="btn btn-secondary" onClick={this.post}>
                      Post
                      </button>
                  </div>
                  <div>
                    {
                      this.state.posts.map(function (val, index) {
                        return <div class="form-group" style={{ textAlign: 'left' }} key={index}>
                          <a class="nav-link" href="#" >
                            <img src={'../images/user_icons/' + (val.user.icon != null ? val.user.icon : 0) + '.jpg'}
                              width='50' alt="icon" />
                          </a>
                          {val.user.name + ' - ' + formatDate(val.created_at)}
                          <p>{val.text}</p>
                          <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                            {val.likes > 0 ? (val.likes > 1 ? val.likes + ' Likes' : '1 Like') : ''}
                            <button type="button" class="btn btn-link" onClick={viewCommentField(index)}>
                              <i class="ti-marker-alt"></i> Reply
                            </button>
                            <button type="button" class="btn btn-link" onClick={like(index)}>
                              <i class="ti-thumb-up"></i> {val.liked ? 'Liked' : 'Like'}
                            </button>
                          </div>
                          {
                            val.comments.map(function (val2, index2) {
                              return <div key={'sub' + val2.id}><a class="nav-link" href="#" >
                                <img src={'../images/user_icons/' + (val2.sub_user.icon != null ? val2.sub_user.icon : 0) + '.jpg'}
                                  width='30' alt="icon" />
                              </a>
                                {val2.sub_user.name + ' - ' + formatDate(val2.created_at)}
                                <p>{val2.text}</p>
                              </div>
                            })
                          }
                          <div class="forms-sample" style={{ display: val.commenting ? '' : 'none' }}>
                            <div class="form-group">
                              <textarea class="form-control" name="text" rows="1" value={val.current_comment} onChange={addComment(index)}></textarea>
                            </div>
                            <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                              <button type="submit" class="btn btn-secondary" onClick={comment(index)}>
                                Comment
                              </button>
                            </div>
                          </div>
                        </div>
                      })
                    }
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-md-3 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">&nbsp;</h4>
                <p class="card-description">
                  Members
                  </p>
                <form class="forms-sample">
                  {
                    this.state.users.map(function (val, index) {
                      return <div class="form-group" style={{ textAlign: 'center' }} key={index}>
                        <a class="nav-link" href="#" >
                          <img src={'../images/user_icons/' + (val.user.icon != null ? val.user.icon : 0) + '.jpg'}
                            width='50' alt="icon" />
                        </a>
                        {val.user.name}
                      </div>
                    })
                  }
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  render() {
    let html = this.html(this.formatDate, this.comment, this.viewCommentField, this.addComment, this.like)
    return (
      html
    )
  }
}

export default Community
