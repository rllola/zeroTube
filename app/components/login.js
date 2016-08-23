import React, { Component } from 'react'
import { connect } from 'react-redux'
import ZeroFrame from 'zeroframe'
import { Link } from 'react-router'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  handleClick () {
    ZeroFrame.cmd('certSelect', [['zeroid.bit']], null)
  }

  render () {
    if (this.props.site.cert_user_id) {
      return (
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">{this.props.site.cert_user_id}</a>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to={'/profile/' + this.props.site.cert_user_id}>Profile</Link>
            <a className="dropdown-item disabled" href="#">Settings</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#" onClick={this.handleClick}>Logout</a>
          </div>
        </li>
      )
    } else {
      return (
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={this.handleClick}>Select user</a>
        </li>
      )
    }
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
