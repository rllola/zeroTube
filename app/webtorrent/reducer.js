import { UPDATE_INFO } from './constants'
import Webtorrent from 'webtorrent/webtorrent.min'

const initialState = {
  client: new Webtorrent()
}

export default function webtorrent (state = initialState, action) {
  switch (action.type) {
    case UPDATE_INFO:
      return state
    default:
      return state
  }
}
