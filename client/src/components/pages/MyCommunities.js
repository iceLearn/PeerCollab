import React, { Component } from 'react'
import { userInfo } from '../../info'
import axios from '../../ctrl/AxiosConf'
import Texts from '../../Texts'
import Notifier, { openSnackbar } from '../small-components/Notifier'

const url = 'enrollments'

class CommunityManager extends Component {

  constructor() {
    super()
    this.state = {
      data: []
    }
    this.loadData()
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: [e.target.value] })
  }

  loadData() {
    axios.get(url + '/my-communities/').then(res => {
      this.setState({
        data: res.data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  viewCommunity = (index) => e => {
    let courseId = this.state.data[index].community.id
    this.props.history.push('/community/' + courseId)
  }

  html = (viewCommunity) => (
    <div class="content-wrapper">
      <div>
        <div class="row">
          <div class="col-10">
            <h5>My Communities</h5>
          </div>
        </div>
        <div class="row" style={{ display: this.state.data.length === 0 ? '' : 'none' }}>
          <div class="col-10">
            <h6>You have not enrolled in any course yet.</h6>
          </div>
        </div>
        <div class="row" >
          {
            this.state.data.map(function (val, index) {
              return <div class="col-md-3 grid-margin stretch-card" key={index}>
                <div class="card" key={index}>
                  <div class="card-body" onClick={viewCommunity(index)}>
                    <h3 class="card-title text-md-center">{val.community.name}</h3>
                    <h5 class="card-title text-md-center">{val.community.course.name}</h5>
                    <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                      <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                        {val.community.description}
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
    let html = this.html(this.viewCommunity)
    return (
      html
    )
  }
}

export default CommunityManager
