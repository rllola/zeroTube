import React, { Component } from 'react';
import Constants from '../util/constants';
import { Link } from 'react-router';


class MainLayout extends Component {
  render() {
    return (
      <div className="app">
        <nav className="navbar navbar-light bg-faded">
          <Link to={`${Constants.APP_ID}`} className="navbar-brand col-xs-1"><img src="public/img/zero_bleu.png" height="35" /></Link>
          <div>
            <form className="form-inline col-xs-6" name="searchForm" onsubmit="ZeroTube.submit(event);">
              <input className="form-control" id="query" type="text" name="query" placeholder="search" />
              <input className="btn btn-primary-outline" type="submit" value="Submit" />
            </form>
          </div>
          <ul className="nav navbar-nav col-xs-3">
            <li className="nav-item">
              <a className="nav-link" href="#Select+user" id="select_user" onclick="return ZeroTube.selectUser()">Select user</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="modal" data-target="#myModal" href="#">Upload</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="?how-to">How it works</a>
            </li>
          </ul>
        </nav>
        <main className="container">
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default MainLayout;
