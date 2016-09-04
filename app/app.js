import Constants from './util/constants'
import ZeroFrame from 'zeroframe'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
//  import LocalStorage from './util/localstorage.js'
import { updateInfo } from './site/actions'

import Router from './router'
import rootReducer from './reducers'

//  Create store
const store = createStore(rootReducer, applyMiddleware(thunk))

//  Update store with data site info.
ZeroFrame.cmd('siteInfo', {}, (info) => {
  // This need to be here because we need information on user fast (not optimal)
  store.dispatch(updateInfo(info))
  //  Get total number of Video
  ZeroFrame.cmd('dbQuery', ['SELECT COUNT(*) AS total FROM video'], (totalVideo) => {
    Object.assign(info, {'total_video': totalVideo[0].total})
    store.dispatch(updateInfo(info))
  })
})

// Render only once we have those information
render(
  <Provider store={store}>
    {Router(store)}
  </Provider>,
  document.getElementById('root')
)

ZeroFrame.route = function (cmd, message) {
  let info = message.params
  store.dispatch(updateInfo(info))
  return ZeroFrame.log('Store updated with')
}

window.history.pushState = function (state, title, url) {
  var relativeUrl = url.split(Constants.APP_ID).pop()
  ZeroFrame.cmd('wrapperPushState', [state, title, relativeUrl])
}

window.history.replaceState = function (state, title, url) {
  var relativeUrl = url.split(Constants.APP_ID).pop()
  ZeroFrame.cmd('wrapperReplaceState', [state, title, relativeUrl])
}
