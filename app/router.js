import Constants from './util/constants';
import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

// Layouts
import MainLayout from './components/main.layout';

// Pages
import Home from './components/Home/home';
import Tutorial from './components/Tutorial/tutorial';
import AboutMe from './components/About/about-me';
import Messages from './components/Messages/messages';

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path={`/${Constants.APP_ID}`} component={Home}/>
      <Route path="tutorial" component={Tutorial} />
      <Route path="about-me" component={AboutMe} />
      <Route path="messages" component={Messages} />
      <Route from="*" to="{`/${Constants.APP_ID}`}" />
    </Route>
  </Router>
);
