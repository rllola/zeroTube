import React, { Component } from 'react'
import Navbar from './navbar'

class MainLayout extends Component {
  render () {
    let style = {
      paddingTop: '20px'
    }
    return (
      <div className="app">
        <Navbar />
        <main className="container" style={style}>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default MainLayout
