import { combineReducers } from 'redux'
import site from './site/reducer'
import videos from './videos/reducer'
import webtorrent from './webtorrent/reducer'

const rootReducer = combineReducers({
  webtorrent,
  videos,
  site
})

export default rootReducer
