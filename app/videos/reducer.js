import { GET_VIDEOS, LOAD_MORE } from './constants'

const initialState = []

export default function site (state = initialState, action) {
  switch (action.type) {
    case GET_VIDEOS:
      return Object.assign([], [], action.videos)
    case LOAD_MORE:
      return state.concat(action.videos)
    default:
      return state
  }
}
