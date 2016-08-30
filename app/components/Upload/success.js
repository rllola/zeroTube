import React, { Component } from 'react'

class Success extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className="alert alert-success" role="alert">
        <strong>Success !</strong> Your video has been added successfully ! Add the link below to your Webtorrent Desktop !<br />
        <input className="form-control" type="text" value={this.props.magnetURI} /> <br />
        <a className="nav-link" target="_blank" href={this.props.magnetURI}>[ Magnet URI ] </a>
      </div>
    )
  }
}

export default Success
