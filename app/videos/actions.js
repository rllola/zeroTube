import * as types from './constants'

export function updateVideos (videos) {
  return {
    type: types.UPDATE_VIDEOS,
    videos
  }
}

export function loadMore (videos) {
  return {
    type: types.LOAD_MORE,
    videos
  }
}
