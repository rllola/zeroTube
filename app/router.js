import Constants from './util/constants'
import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { latestVideos } from './videos/actions'

//  Layouts
import MainLayout from './components/main.layout'

//  Pages
import Home from './components/Home/home'
import How from './components/How/how'
import Upload from './components/Upload/upload'
import Watch from './components/Watch/watch'
import Search from './components/Search/result'
import Profile from './components/Profile/profile'
import Edit from './components/Edit/edit'

function getLatestVideos (store) {
  store.dispatch(latestVideos())
}

export default (store) => {
  const redirect = function redirect (nextState, replace, callback) {
    var start = nextState.location.search.indexOf('wrapper_nonce')
    var path = nextState.location.search.substring(0, start)

    if (path.indexOf('&')) {
      var index = path.indexOf('&')
      path = path.substring(0, index)
    }

    if (nextState.location.search) {
      replace(path.slice(2))
    }

    callback()
  }

  return (
    <Router history={browserHistory}>
      <Route path={`/${Constants.APP_ID}`} component={MainLayout} onEnter={redirect} >
        <IndexRoute component={Home} onEnter={getLatestVideos(store)} />
        <Route path="/upload" component={Upload} />
        <Route path="/how" component={How} />
        <Route path="/watch/:json/:torrentID" component={Watch} />
        <Route path="/search" component={Search} />
        <Route path="/profile/:zeroID" component={Profile} />
        <Route path="/edit/:json/:torrentID" component={Edit} />
        <Route from="*" to="{`/${Constants.APP_ID}`}" />
      </Route>
    </Router>
  )
}
