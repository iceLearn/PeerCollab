import React from 'react'

function LoginComponent(props) {

  return (
    <div class='auth-form-light text-left py-5 px-4 px-sm-5'>
      <div class='brand-logo'>
        <img src='images/logo.svg' alt='logo' />
      </div>
      <h4>Hello! let's get started</h4>
      <h6 class='font-weight-light'>Sign in to continue.</h6>
      <form class='pt-3' onSubmit={props.data.onSubmit}>
        <div class='form-group'>
          <input type='email' class='form-control' id='username' name='username' placeholder='Username'
            value={props.data.state.username} onChange={props.data.onChange} autoFocus />
        </div>
        <div class='form-group'>
          <input type='password' class='form-control' id='password' name='password' placeholder='Password'
            value={props.data.state.password} onChange={props.data.onChange} />
        </div>
        <div class='mt-3'>
          <a class='btn btn-block btn-primary font-weight-medium auth-form-btn' href='' onClick={props.data.onSubmit}>SIGN IN</a>
        </div>
        <div class='my-2 d-flex justify-content-between align-items-center'>
          {/* <div class='form-check'>
            <label class='form-check-label text-muted'>
              <input type='checkbox' class='form-check-input' />
                            Keep me signed in
            </label>
          </div> */}
          {/* <a href='#' class='auth-link text-black'>Forgot password?</a> */}
        </div>
        {/* <div class='mb-2'>
          <button type='button' class='btn btn-block btn-facebook auth-form-btn'>
            <i class='ti-facebook mr-2'></i>Connect using facebook
          </button>
        </div> */}
        <div class='text-center mt-4 font-weight-light'>
          Don't have an account? <a href='#' class='text-primary' onClick={props.data.clickRegister}>Create</a>
        </div>
      </form>
    </div>
  )
}

export default LoginComponent
