import React, { Component } from 'react'
import { userInfo } from '../../info'
import axios from '../../ctrl/AxiosConf'
import Texts from '../../Texts'
import Notifier, { openSnackbar } from '../small-components/Notifier'

const url = 'communities'
let id = 0

class Community extends Component {

  constructor() {
    super()
    this.state = {
      id: 0,
      data: {},
      enrolled: false,
      enrollment: 0,
      posts: [],
      users: [],
      text: '',
      timeId: 0,
      active: true
    }
  }

  componentDidMount() {
    window.addEventListener("focus", this.onFocus)
    window.addEventListener("blur", this.onBlur)
    this.setState({
      id: this.props.match.params.id,
      data: {},
      enrolled: false,
      enrollment: 0,
      posts: [],
      users: [],
      text: '',
      timeId: 0,
      active: true
    }, () => {
      console.log(this.state.data)
      this.checkEnrollment()
      this.loadCommunity()
    })
  }

  componentWillUnmount() {
    id = 0
    window.removeEventListener("focus", this.onFocus)
    window.removeEventListener("blur", this.onBlur)
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps
    this.componentDidMount()
  }

  onFocus = () => {
    this.setState({ active: true })
  }
  onBlur = () => {
    this.setState({ active: false })
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
        let enrolled = false
        if (res.data[0].state == 'ENROLLED') {
          enrolled = true
        }
        this.setState({
          enrolled: enrolled,
          enrollment: res.data[0]
        })
        id = this.state.id
        this.saveTime(this.state.id)
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
          enrollment: 0,
          posts: [],
          users: []
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  saveTime = (communityId) => {
    if (this.state.timeId === 0) {
      axios.post('active-periods', { 'community_id': this.state.id }).then(res => {
        this.setState({
          timeId: res.data.id
        })
      }).catch(err => {
        console.log(err)
      })
    } else {
      if (this.state.active) {
        axios.put('active-periods', {
          'id': this.state.timeId
        }).then(res => {

        }).catch(err => {
          console.log(err)
        })
      }
    }
    if (id === communityId) {
      setTimeout(() => {
        this.saveTime(communityId)
      }, 15000);
    }
  }

  enroll = (e) => {
    e.preventDefault()
    if (this.state.enrollment == 0) {
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
    } else {
      axios.put('enrollments', {
        'id': this.state.enrollment.id,
        'state': 'ENROLLED'
      }).then(res => {
        if (res.data.status === true) {
          // openSnackbar({ variant: 'success', message: Texts.MSG_SAVE_SUCCESS })
          this.loadCommunity()
          this.checkEnrollment()
        } else {
          openSnackbar({ variant: 'error', message: Texts[res.data.message] })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  leave = (e) => {
    e.preventDefault()
    axios.put('enrollments', {
      'id': this.state.enrollment.id,
      'state': 'LEFT'
    }).then(res => {
      if (res.data.status === true) {
        // openSnackbar({ variant: 'success', message: Texts.MSG_SAVE_SUCCESS })
        this.loadCommunity()
        this.checkEnrollment()
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.data.message] })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  removeUser = (id) => e => {
    e.preventDefault()
    axios.put('enrollments', {
      'id': id,
      'state': 'BLOCKED'
    }).then(res => {
      if (res.data.status === true) {
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
    if (e.key === 'Enter') {
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

  deleteActivity = (id) => e => {
    axios.delete('activities/' + id).then(res => {
      if (res.data.status === true) {
        this.loadPosts()
      } else {
        openSnackbar({ variant: 'error', message: Texts[res.data.message] })
      }
    }).catch(err => {
      console.log(err)
    })
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

  viewUser = (id) => e => {
    this.props.history.push('/user/' + id)
  }

  formatDate(date) {
    return date.substring(0, 19).replace('T', ' ')
  }

  html = (formatDate, comment, viewCommentField, addComment, like, viewUser, deleteActivity, removeUser, userId) => (
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
                <div class="box box-widget">
                  {
                    this.state.posts.map(function (val, index) {
                      return <div class="form-group" style={{ textAlign: 'left' }} key={'p' + index}>
                        <div class="box-header with-border">
                          <div class="user-block" onClick={viewUser(val.user.id)}>
                            <img class="avatar" src={'../images/user_icons/' + (val.user.icon != null ? val.user.icon : 0) + '.jpg'} alt="User Image" />
                            <span class="username">{val.user.name}</span>
                            <span class="description">{formatDate(val.created_at)}</span>
                          </div>
                          <div class="box-tools" style={{ display: userInfo['id'] == val.user.id ? '' : 'none' }}>
                            <button type="button" class="btn btn-box-tool" data-widget="remove" onClick={deleteActivity(val.id)}><i class="fa fa-times"></i></button>
                          </div>
                        </div>
                        <div class="box-body" style={{ display: 'block' }}>
                          {/* <img class="img-responsive pad" src="https://via.placeholder.com/600x300/" alt="Photo" /> */}
                          <p>{val.text}</p>
                          {/* <button type="button" class="btn btn-default btn-xs"><i class="fa fa-share"></i> Share</button> */}
                          <button type="button" class="btn btn-default btn-xs" onClick={like(index)}><i class="fa fa-thumbs-o-up"></i> {val.liked ? 'Liked' : 'Like'}</button>
                          <button type="button" class="btn btn-default btn-xs" onClick={viewCommentField(index)}><i class="ti-marker-alt"></i> Reply</button>
                          <span class="pull-right text-muted">{val.likes > 0 ? (val.likes > 1 ? val.likes + ' Likes' : '1 Like') : ''}</span>
                        </div>
                        <div class="box-footer box-comments" style={{ display: 'block' }}>
                          {
                            val.comments.map(function (val2, index2) {
                              return <div class="box-comment" key={'sub' + val2.id}>
                                <img class="img-circle img-sm avatar" src={'../images/user_icons/'
                                  + (val2.sub_user.icon != null ? val2.sub_user.icon : 0) + '.jpg'} alt="User Image" onClick={viewUser(val2.sub_user.id)} />
                                <div class="comment-text">
                                  <span class="username">
                                    <span onClick={viewUser(val2.sub_user.id)}> {val2.sub_user.name}</span>
                                    <span class="text-muted pull-right">
                                      {formatDate(val2.created_at)}
                                      <button type="button" class="btn btn-box-tool" style={{ display: userInfo['id'] == val2.sub_user.id ? '' : 'none' }}
                                        data-widget="remove" onClick={deleteActivity(val2.id)}><i class="fa fa-times"></i></button>
                                    </span>
                                  </span>
                                  {val2.text}
                                </div>
                              </div>
                            })
                          }
                        </div>
                        <div class="box-footer" style={{ display: 'block', display: val.commenting ? '' : 'none' }}>
                          <form action="#" method="post">
                            <img class="img-responsive img-circle img-sm avatar" src={'../images/user_icons/' + (userInfo.icon != null ? userInfo.icon : 0) + '.jpg'} alt="Alt Text" />
                            <div class="img-push">
                              <input type="text" class="form-control input-sm"
                                placeholder="Press enter to post comment" value={val.current_comment}
                                onChange={addComment(index)} onKeyDown={comment(index)} />
                            </div>
                          </form>
                        </div>
                      </div>
                    })
                  }
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">&nbsp;</h4>
                <button type="submit" class="btn btn-secondary" onClick={this.leave}
                  style={{ display: this.state.data.user_id != userInfo['id'] ? '' : 'none' }}>
                  Leave Community
                </button>
                <p class="card-description">
                  Members
                </p>
                <form class="forms-sample">
                  {
                    this.state.users.map(function (val, index) {
                      return <div key={index}>
                        <div class="user-block" onClick={viewUser(val.id)}>
                          <img class="avatar" src={'../images/user_icons/' + (val.user.icon != null ? val.user.icon : 0) + '.jpg'}
                            width='50' alt="icon" style={{ border: '2px solid ' + (val.level === 0 ? 'red' : 'blue') }} title={(val.level === 0 ? 'Community User' : 'Community Creator')} />
                          <span class="username">{val.user.name}</span>
                        </div>
                        <span class="text-muted pull-right">
                          <button type="button" class="btn btn-box-tool" style={{ display: userInfo['id'] == userId ? (userInfo['id'] != val.user.id ? '' : 'none') : 'none' }}
                            data-widget="remove" onClick={removeUser(val.id)}><i class="fa fa-times"></i></button>
                        </span>
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
    let html = this.html(this.formatDate, this.comment, this.viewCommentField, this.addComment,
      this.like, this.viewUser, this.deleteActivity, this.removeUser, this.state.data.user_id)
    return (
      html
    )
  }
}

export default Community
