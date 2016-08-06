import { UPDATE_VIDEOS } from './constants'

const initialState = []

export default function site (state = initialState, action) {
  switch (action.type) {
    case UPDATE_VIDEOS:
      return Object.assign([], state, action.videos)
    default:
      return state
  }
}
