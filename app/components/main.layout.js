import React, { Component } from 'react'
import Constants from '../util/constants'
import Login from './login'
import { Link } from 'react-router'

class MainLayout extends Component {
  render () {
    let style = {
      paddingTop: '20px'
    }
    return (
      <div className="app">
        <nav className="navbar navbar-light bg-faded">
          <Link to={`${Constants.APP_ID}`} className="navbar-brand col-xs-1"><img src="public/img/zerotube-logo.svg" height="35" /></Link>
          <div>
            <form className="form-inline" name="searchForm" onsubmit="ZeroTube.submit(event);">
              <input className="form-control" id="query" type="text" name="query" placeholder="Search" />
              <input className="btn-glass" type="submit" value="Submit" />
            </form>
          </div>
          <ul className="nav navbar-nav col-xs-3">
            <li className="nav-item">
              <Login />
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="upload">Upload</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="how">How it works</Link>
            </li>
          </ul>
        </nav>
        <main className="container" style={style}>
          {this.props.children}
        </main>
      </div>
    )
  }
}

export default MainLayout
