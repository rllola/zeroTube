import { UPDATE_INFO } from './constants'

export default function torrents (state = {}, action) {
  switch (action.type) {
    case UPDATE_INFO:
      return Object.assign({}, state, action.info)
    default:
      return state
  }
}
