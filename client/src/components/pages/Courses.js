import React, { Component } from 'react'
import { userInfo } from '../../info'
import axios from '../../ctrl/AxiosConf'
import { shortenDescription } from '../../ctrl/Validator'
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
      courseName: '',
      courseDescription: '',
      query: ''
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
    let course = this.state.courses[index]
    this.setState({
      courseId: course.id,
      courseName: course.name,
      courseDescription: course.description
    }, () => {
      this.loadData()
    })
  }

  viewCommunity = (index) => e => {
    let courseId = this.state.data[index].id
    this.props.history.push('/community/' + courseId)
  }

  search = e => {
    this.setState({
      query: e.target.value
    }, () => {
      this.loadCourses()
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
    let url = 'courses'
    if (this.state.query != '') {
      url = 'courses/search/' + this.state.query
    }
    axios.get(url).then(res => {
      this.setState({
        courses: res.data,
        courseId: 0
      })
    }).catch(err => {
      console.log(err)
    })
  }

  html = (viewCommunities, viewCommunity) => (
    <div class="content-wrapper">
      <div style={{ display: this.state.courseId === 0 ? '' : 'none' }}>
        <div class="row">
          <div class="col-12">
            <h5>Select a course</h5>
          </div>
          <div class="col-12">
            <div class="input-group">
              <div class="input-group-prepend hover-cursor" id="navbar-search-icon">
                <span class="input-group-text" id="search">
                  <i class="ti-search"></i>
                </span>
              </div>
              <input type="text" class="form-control" id="navbar-search-input" placeholder="Search course"
                aria-label="search" aria-describedby="search" onChange={this.search} value={this.state.query} />
            </div>
          </div>
        </div>
        <div class="row">
          <h2></h2>
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
                        {shortenDescription(val.description)}
                      </p>
                    </div>
                    <div class="mt-4">
                      <div class="card-info float-left text-center">
                        <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>{val.enrollments}</p>
                      </div>
                      <div class="card-info float-right text-center">
                        <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>{val.activities}</p>
                      </div>
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
            <h5>Communities of the course: {this.state.courseName}</h5>
            <p>{this.state.courseDescription}</p>
          </div>
        </div>
        <div class="row" >
          {
            this.state.data.map(function (val, index) {
              return <div class="col-md-3 grid-margin stretch-card" key={index}>
                <div class="card" key={index}>
                  <div class="card-body" onClick={viewCommunity(index)}>
                    <h3 class="card-title text-md-center">{val.name}</h3>
                    <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                      <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                        {shortenDescription(val.description)}
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
    let html = this.html(this.viewCommunities, this.viewCommunity)
    return (
      html
    )
  }
}

export default CommunityManager
