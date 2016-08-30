import React, { Component } from 'react'

class Warning extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>Duplicate</strong> This video is already available on your channel !
        Come on I am sure you have a new video to share with us.
      </div>
    )
  }
}

export default Warning
