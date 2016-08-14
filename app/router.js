import Constants from './util/constants'
import React from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

//  Layouts
import MainLayout from './components/main.layout'

//  Pages
import Home from './components/Home/home'
import How from './components/How/how'
import Upload from './components/Upload/upload'
import Watch from './components/Watch/watch'
import Search from './components/Search/result'

export default (
  <Router history={browserHistory}>
    <Route path={`/${Constants.APP_ID}`} component={MainLayout}>
      <IndexRoute component={Home} />
      <Route path="/upload" component={Upload} />
      <Route path="/how" component={How} />
      <Route path="/watch/:torrentID" component={Watch} />
      <Route path="/search" component={Search} />
      <Route from="*" to="{`/${Constants.APP_ID}`}" />
    </Route>
  </Router>
)
