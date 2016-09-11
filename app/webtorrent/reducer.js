import { UPDATE_INFO } from './constants'
import Webtorrent from 'webtorrent/webtorrent.min'
import rtcConfig from '../../rtcConfig.json'

const initialState = {
  client: new Webtorrent({
    tracker: {
      rtcConfig: rtcConfig
    }
  })
}

export default function webtorrent (state = initialState, action) {
  switch (action.type) {
    case UPDATE_INFO:
      return state
    default:
      return state
  }
}
