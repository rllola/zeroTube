import React, { Component } from 'react';

class Login extends Component {
  render() {
    return (
      <a className="nav-link" href="#Select+user" id="select_user" onclick="return ZeroTube.selectUser()">Select user</a>
    );
  }
};

export default Login;
