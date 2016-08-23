import Constants from './util/constants'
import React from 'react'
import ZeroFrame from 'zeroframe'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { updateVideos } from './videos/actions'

//  Layouts
import MainLayout from './components/main.layout'

//  Pages
import Home from './components/Home/home'
import How from './components/How/how'
import Upload from './components/Upload/upload'
import Watch from './components/Watch/watch'
import Search from './components/Search/result'
import Profile from './components/Profile/profile'

function getLatestVideos (store) {
  let cmd = 'dbQuery'
  let query = "SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address FROM video LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') ORDER BY date_added DESC LIMIT 5"
  ZeroFrame.cmd(cmd, [query], (data) => {
    store.dispatch(updateVideos(data))
  })
}

function searchVideos (store) {
  let cmd = 'dbQuery'
  let query = "SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address FROM video LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') ORDER BY date_added DESC LIMIT 5"
  ZeroFrame.cmd(cmd, [query], (data) => {
    store.dispatch(updateVideos(data))
  })
}

export default (store) => {
  return (
    <Router history={browserHistory}>
      <Route path={`/${Constants.APP_ID}`} component={MainLayout}>
        <IndexRoute component={Home} onEnter={getLatestVideos(store)} />
        <Route path="/upload" component={Upload} />
        <Route path="/how" component={How} />
        <Route path="/watch/:torrentID" component={Watch} />
        <Route path="/search" component={Search} onEnter={searchVideos(store)} />
        <Route path="/profile" component={Profile} />
        <Route from="*" to="{`/${Constants.APP_ID}`}" />
      </Route>
    </Router>
  )
}
