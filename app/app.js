import Constants from './util/constants';
import ZeroFrame from 'zeroframe';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LocalStorage from './util/localstorage.js';
import { updateInfo } from './site/actions';

import Router from './router';
import rootReducer from './reducers';

//Create store
let store = createStore(rootReducer);

// Update store with data site info.
ZeroFrame.cmd("siteInfo", {}, (info)=> {
  store.dispatch(updateInfo(info));
});

// Now we can attach the router to the 'root' element like this:
render(
  <Provider store={store}>
    {Router}
  </Provider>,
  document.getElementById('root')
);

ZeroFrame.route = function(cmd, message) {
  let info = message.params;
  store.dispatch(updateInfo(info));
  return ZeroFrame.log("Store updated with");
};

window.history.pushState = function(state, title, url) {
  var relative_url = url.split(Constants.APP_ID).pop();
  ZeroFrame.cmd("wrapperPushState", [state, title, relative_url]);
};
window.history.replaceState = function(state, title, url) {
  var relative_url = url.split(Constants.APP_ID).pop();
  ZeroFrame.cmd("wrapperReplaceState", [state, title, relative_url]);
};
