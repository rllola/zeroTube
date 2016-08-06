import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClick () {
    ZeroFrame.cmd('certSelect', [['zeroid.bit']], null)
  }

  render () {
    return (
      <a className='nav-link' href='#' id='select_user' onClick={this.handleClick}>Select user</a>
    )
  }
};

function mapStateToProps (state) {
  return {
    site: state.site
  }
}

export default connect(
  mapStateToProps
)(Login)
