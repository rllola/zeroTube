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
    let user

    if (this.props.site.cert_user_id) {
      user = this.props.site.cert_user_id
    } else {
      user = 'Select user'
    }

    return (
      <div>
        <a className="nav-link" href="#" onClick={this.handleClick}>{user}</a>
      </div>
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
