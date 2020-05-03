import React, { Component } from 'react'
import { userInfo } from '../../info'
import axios from '../../ctrl/AxiosConf'
import Texts from '../../Texts'
import Notifier, { openSnackbar } from '../small-components/Notifier'

const url = 'communities'

class CommunityManager extends Component {

  constructor() {
    super()
    this.state = {
      data: [],
      courses: [],
      courseId: 0,
    }
    this.loadCourses()
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: [e.target.value] })
  }

  back = (e) => {
    e.preventDefault()
    this.loadCourses()
  }

  viewCommunities = (index) => e => {
    this.setState({
      courseId: this.state.courses[index].id
    }, () => {
      this.loadData()
    })
  }

  loadData() {
    axios.get(url + '/by-course/' + this.state.courseId).then(res => {
      let courseId = 0
      if (res.data.length > 0) {
        courseId = res.data[0].id
      }
      this.setState({
        data: res.data,
        page: 'view',
        id: null,
        courseId: courseId
      })
    }).catch(err => {
      console.log(err)
    })
  }

  loadCourses() {
    axios.get('courses').then(res => {
      this.setState({
        courses: res.data,
        courseId: 0
      })
    }).catch(err => {
      console.log(err)
    })
  }

  html = (viewCommunities) => (
    <div class="content-wrapper">
      <div style={{ display: this.state.courseId === 0 ? '' : 'none' }}>
        <div class="row">
          <div class="col-12">
            <h5>Select a course</h5>
          </div>
        </div>
        <div class="row" >
          {
            this.state.courses.map(function (val, index) {
              return <div class="col-md-3 grid-margin stretch-card" key={index}>
                <div class="card" key={index}>
                  <div class="card-body" onClick={viewCommunities(index)}>
                    <h3 class="card-title text-md-center">{val.name}</h3>
                    <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                      <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                        {val.description}
                      </p>
                    </div>
                    <div class="mt-4">
                      {/* <div class="card-info float-left text-center">
                      <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                    </div> */}
                      {/* <div class="card-info float-right text-center">
                      <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
      <div style={{ display: this.state.courseId > 0 ? '' : 'none' }}>
        <div class="row">
          <div class="col-md-1">
            <div class="form-group">
              <a href="#" onClick={this.back}>Back</a>
            </div>
          </div>
          <div class="col-10">
            <h5>Select a community</h5>
          </div>
        </div>
        <div class="row" >
          {
            this.state.data.map(function (val, index) {
              return <div class="col-md-3 grid-margin stretch-card" key={index}>
                <div class="card" key={index}>
                  <div class="card-body" onClick={viewCommunities(index)}>
                    <h3 class="card-title text-md-center">{val.name}</h3>
                    <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                      <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                        {val.description}
                      </p>
                    </div>
                    <div class="mt-4">
                      {/* <div class="card-info float-left text-center">
                        <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                      </div> */}
                      {/* <div class="card-info float-right text-center">
                        <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>
    </div>
  )
  render() {
    let html = this.html(this.viewCommunities)
    return (
      html
    )
  }
}

export default CommunityManager
