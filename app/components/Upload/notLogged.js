import React, { Component } from 'react'

class NotLogged extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>Darn !</strong> You need to be logged in with a valid zeroid
        account. Go and click on the 'select user' link and try again.
      </div>
   )
  }
};

export default NotLogged
