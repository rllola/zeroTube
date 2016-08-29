import React, { Component } from 'react'

class Error extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Shoo !</strong> Something bad happened. Seeding not happening, sorry.
      </div>
    )
  }
}

export default Error
