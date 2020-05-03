import React, { Component } from 'react'

class Landing extends Component {
  html = (classes) => (
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-12 grid-margin">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4 class="font-weight-bold mb-0">PeerCollab - User Dashboard</h4>
            </div>
            <div>
              <button type="button" class="btn btn-primary btn-icon-text btn-rounded">
                <i class="ti-clipboard btn-icon-prepend"></i>Report
                    </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title text-md-center text-xl-left">User level</p>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <h3 class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  <button type="button" class="btn btn-info btn-rounded btn-icon" data-toggle="tooltip"
                    data-placement="bottom" title="Community user">
                    <i class="ti-star"></i>
                  </button>
                  <button type="button" class="btn btn-success btn-rounded btn-icon" data-toggle="tooltip"
                    data-placement="bottom" title="Community creator">
                    <i class="ti-star"></i>
                  </button>
                  <button type="button" class="btn btn-danger btn-rounded btn-icon" data-toggle="tooltip"
                    data-placement="bottom" title="Activity level 1">
                    <i class="ti-star"></i>
                  </button>
                </h3>
                <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0" style={{ fontSize: 2.5 }}></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title text-md-center text-xl-left">RAPID COMMUNITIES TO IMPROVE LEARNING
</p>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">PeerCollab build strong communities to learn together and instructors can better manage the communities while keeping it strong.
</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <p class="card-title text-md-center text-xl-left">Courses</p>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <h3 class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">61344</h3>
                <i class="ti-layers-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i>
              </div>
              <p class="mb-0 mt-2 text-success">23.00%<span class="text-black ml-1"><small>(30 days)</small></span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h5>My courses</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">Java</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">C++</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">Kotlin</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">MySQL</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h5>My communities</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">Java</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">C++</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">Kotlin</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-md-center">MySQL</h3>
              <div class="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p class="mb-0 mb-md-2 mb-xl-0 order-md-1 order-xl-0">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
              </div>
              <div class="mt-4">
                <div class="card-info float-left text-center">
                  <i class="ti-user icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>30</p>
                </div>
                <div class="card-info float-right text-center">
                  <i class="ti-comment-alt icon-md text-muted mb-0 mb-md-3 mb-xl-0"></i><p>89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 grid-margin stretch-card">
          <div class="card position-relative">
            <div class="card-body">
              <p class="card-title">My activity levels in communities : ABC Community</p>
              <div class="row">
                <div class="col-md-12 col-xl-9">
                  <div class="row">
                    <div class="col-md-6 mt-3 col-xl-5">
                      <p>My Community Status</p>
                      <div class="progress" style={{ height: 20 }}>
                        <div class="progress-bar progress-bar-striped bg-success" style={{ width: 25 }}>
                          Active User
                            </div>
                        <div class="progress-bar progress-bar-striped bg-warning" style={{ width: 25 }}>
                          Moderator
                            </div>
                        <div class="progress-bar progress-bar-striped bg-danger" style={{ width: 25 }}>
                          Leader
                            </div>
                        <div class="progress-bar progress-bar-striped bg-white" style={{ width: 25 }}>
                          Super Leader
                            </div>
                      </div>
                    </div>
                    <div class="col-md-6 col-xl-7">
                      <div class="table-responsive mb-3 mb-md-0">
                        <h4 class="card-title">ABC Community</h4>
                        <canvas id="doughnutChart"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 col-xl-3 d-flex flex-column justify-content-center">
                  <div class="ml-xl-4">
                    <h3 class="font-weight-light mb-xl-4">Time spent in the community</h3>
                    <h2>2 h 30 min</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 grid-margin stretch-card">
          <div class="card position-relative">
            <div class="card-body">
              <p class="card-title">My activity levels in communities : XYZ Community</p>
              <div class="row">
                <div class="col-md-12 col-xl-9">
                  <div class="row">
                    <div class="col-md-6 mt-3 col-xl-5">
                      <p>My Community Status</p>
                      <div class="progress" style={{ height: 20 }}>
                        <div class="progress-bar progress-bar-striped bg-success" style={{ width: 25 }}>
                          Active User
                            </div>
                        <div class="progress-bar progress-bar-striped bg-warning" style={{ width: 25 }}>
                          Moderator
                            </div>
                        <div class="progress-bar progress-bar-striped bg-white" style={{ width: 25 }}>
                          Leader
                            </div>
                        <div class="progress-bar progress-bar-striped bg-white" style={{ width: 25 }}>
                          Super Leader
                            </div>
                      </div>
                    </div>
                    <div class="col-md-6 col-xl-7">
                      <div class="table-responsive mb-3 mb-md-0">
                        <h4 class="card-title">XYZ Community</h4>
                        <canvas id="doughnutChart1"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 col-xl-3 d-flex flex-column justify-content-center">
                  <div class="ml-xl-4">
                    <h3 class="font-weight-light mb-xl-4">Time spent in the community</h3>
                    <h2>4 h 42 min</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  render() {
    var html = this.html(this.props.classes)
    return (
      html
    )
  }
}

export default Landing
