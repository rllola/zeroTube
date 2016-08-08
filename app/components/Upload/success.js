import React, { Component } from 'react'

class Success extends Component {
  constructor (props) {
    super(props)

    console.log(this.props)

    this.state = {}
  }

  render () {
    return (
      <div className="alert alert-info" role="alert">
        <strong>Success !</strong> Your video has been added successfully ! Add the link below to your Webtorrent Desktop !<br />
        <a className="nav-link" href="#">{this.props.magnetURI}</a>
      </div>
    )
  }
}

export default Success
