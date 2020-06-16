import React, { Component } from 'react'
import { userInfo } from '../../info'
import axios from '../../ctrl/AxiosConf'
import {shortenDescription} from '../../ctrl/Validator'
import Texts from '../../Texts'
import Notifier, { openSnackbar } from '../small-components/Notifier'

const url = 'communities'

class CommunityManager extends Component {

  constructor() {
    super()
    this.state = {
      page: 'view',
      id: null,
      data: [],
      entry: {},
      courses: [],
      courseId: 0,
      type: 'ANY'
    }
    this.loadData()
  }

  onChange = (e) => {
    let entry = { ...this.state.entry }
    entry[e.target.name] = e.target.value
    this.setState({ entry: entry })
  }

  onSuperChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  createNew = e => {
    axios.get('courses').then(res => {
      this.setState({
        courses: res.data,
        page: 'edit',
        id: null,
        entry: {}
      }, () => {
        this.setState({
          courseId: (this.state.courses.length > 0 ? this.state.courses[0].id : 0),
          type: 'ANY'
        })
      })
    }).catch(err => {
      console.log(err)
    })
  }

  edit = (index) => e => {
    axios.get('courses').then(res => {
      this.setState({
        courses: res.data,
        page: 'edit',
        id: this.state.data[index].id,
        entry: this.state.data[index],
        courseId: this.state.data[index].course_id,
        type: this.state.data[index].type
      })
    }).catch(err => {
      console.log(err)
    })
  }

  cancel = (e) => {
    e.preventDefault()
    this.loadData()
  }

  save = (e) => {
    e.preventDefault()
    this.state.entry.course_id = this.state.courseId
    this.state.entry.type = this.state.type
    console.log(this.state.entry)
    if (this.state.id > 0) {
      axios.put(url, this.state.entry).then(res => {
        if (res.data.status === true) {
          openSnackbar({ variant: 'success', message: Texts.MSG_SAVE_SUCCESS })
          this.loadData()
        } else {
          openSnackbar({ variant: 'error', message: Texts[res.data.message] })
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      axios.post(url, this.state.entry).then(res => {
        if (res.data.status === true) {
          openSnackbar({ variant: 'success', message: Texts.MSG_SAVE_SUCCESS })
          this.loadData()
        } else {
          openSnackbar({ variant: 'error', message: Texts[res.data.message] })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  loadData() {
    axios.get(url + '/by-user').then(res => {
      let courseId = 0
      if (res.data.length > 0) {
        courseId = res.data[0].course_id
      }
      console.log(res.data)
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

  html = (edit) => (
    <div class="content-wrapper">
      <div style={{ display: this.state.page === 'view' ? '' : 'none' }}>
        <div class="row">
          <div class="col-12">
            <h5>Manage Communities</h5>
          </div>
        </div>
        <div class="row" >
          {
            this.state.data.map(function (val, index) {
              return <div class="col-md-3 grid-margin stretch-card">
                <div class="card" key={index}>
                  <div class="card-body">
                    <h3 class="card-title text-md-center">{val.name}</h3>
                    <h5 class="card-title text-md-center">{val.course.name}</h5>
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
                  <div class="card-body text-md-center">
                    <button type="submit" class="btn btn-secondary" onClick={edit(index)}>Edit</button>
                  </div>
                </div>
              </div>
            })
          }
          <div class="col-md-3 grid-margin stretch-card">
            <div class="card">
              <div class="card-body" onClick={this.createNew}>
                <h4 class="text-center text-uppercase">Create a community</h4>
                <div class="d-flex flex-wrap justify-content-between justify-content-md-center  align-items-center">
                  <div class="text-center" style={{ fontSize: 5 }}><i class="ti-plus icon-md text-muted mb-xl-0"></i></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: this.state.page === 'edit' ? '' : 'none' }}>
        <div class="row">
          <div class="col-12 grid-margin">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title">{this.state.id === null ? 'Create New Community' : 'Edit Course'}</h4>
                <form class="form-sample">
                  <p class="card-description">
                  </p>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="exampleFormControlSelect1">Select course</label>
                        <select class="form-control" id="courseId" name="courseId" onChange={this.onSuperChange}
                          value={this.state.courseId}>
                          {
                            this.state.courses.map(function (val, index) {
                              return <option value={val.id} key={val.id}>{val.name}</option>
                            })
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Community Name</label>
                        <div>
                          <input type="text" class="form-control" name="name" onChange={this.onChange}
                            value={this.state.entry.hasOwnProperty('name') ? this.state.entry.name : ''} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="exampleTextarea1">Description</label>
                        <textarea class="form-control" id="exampleTextarea1" rows="4" name="description" onChange={this.onChange}
                          value={this.state.entry.hasOwnProperty('description') ? this.state.entry.description : ''}></textarea>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="exampleFormControlSelect1">Membership</label>
                        <select class="form-control" id="type" name="type" onChange={this.onSuperChange}
                          value={this.state.type}>
                          <option value='ANY' key="1">Anyone can join</option>
                          <option value='INVITATION' key="2">By Invitation</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <p>By creating a community, It will be my responsibility to keep my community active, moderate and engaging. I will ensure the members adhere to the community guidelines.</p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-3">
                      <div class="form-group">
                        <button type="submit" class="btn btn-primary" onClick={this.save}>{this.state.id === null ? 'Create' : 'Update'} Community</button>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="form-group">
                        <button type="submit" class="btn btn-secondary" onClick={this.cancel}>Cancel</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  render() {
    let html = this.html(this.edit)
    return (
      html
    )
  }
}

export default CommunityManager
