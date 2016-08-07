import { combineReducers } from 'redux'
import site from './site/reducer'
import videos from './videos/reducer'

const rootReducer = combineReducers({
  videos,
  site
})

export default rootReducer
