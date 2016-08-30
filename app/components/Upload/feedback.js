import React, { Component } from 'react'
import Success from './success'
import Error from './error'

class Feedback extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    switch (this.props.status) {
      case 'is_uploading':
        return <div className="alert alert-info" role="alert">Preparing torrent... Please wait.</div>
      case 'is_uploaded':
        return <Success magnetURI={this.props.magnetURI} />
      case 'error':
        return <Error />
      default:
        return null
    }
  }
}

export default Feedback
