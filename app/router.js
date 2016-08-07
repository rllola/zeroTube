import Constants from './util/constants'
import React from 'react'
import { Router, Route, browserHistory } from 'react-router'

//  Layouts
import MainLayout from './components/main.layout'

//  Pages
import Home from './components/Home/home'
import How from './components/How/how'
import Upload from './components/Upload/upload'

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path={`/${Constants.APP_ID}`} component={Home} />
      <Route path="upload" component={Upload} />
      <Route path="how" component={How} />
      <Route from="*" to="{`/${Constants.APP_ID}`}" />
    </Route>
  </Router>
)
