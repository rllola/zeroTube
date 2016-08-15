import React, { Component } from 'react'
import Constants from '../util/constants'
import Login from './login'
import ZeroFrame from 'zeroframe'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as videosActions from '../videos/actions'

class MainLayout extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.state = {}
  }

  handleQueryChange (e) {
    this.setState({query: e.target.value})
  }

  handleSubmit (e) {
    e.preventDefault()
    let cmd = 'dbQuery'
    let query = "SELECT * FROM video WHERE title LIKE '%" + this.state.query + "%'"
    ZeroFrame.cmd(cmd, [query], (data) => {
      this.props.actions.updateVideos(data)
      this.context.router.push({pathname: '/search'})
    })
  }

  render () {
    let style = {
      paddingTop: '20px'
    }
    return (
      <div className="app">
        <nav className="navbar navbar-light bg-faded">
          <Link to={`${Constants.APP_ID}`} className="navbar-brand col-xs-1"><img src="public/img/zerotube-logo.svg" height="35" /></Link>
          <div>
            <form className="form-inline" name="searchForm" onSubmit={this.handleSubmit} >
              <input className="form-control" value={this.state.query} onChange={this.handleQueryChange} type="text" name="query" placeholder="Search" />
              <input className="btn-glass" type="submit" value="Submit" />
            </form>
          </div>
          <ul className="nav navbar-nav col-xs-3">
            <li className="nav-item">
              <Login />
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">Upload</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/how">How it works</Link>
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

MainLayout.contextTypes = {
  router: React.PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    videos: state.videos
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(videosActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainLayout)
