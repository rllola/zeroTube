import * as types from './constants'
import ZeroFrame from 'zeroframe'

export function latestVideos () {
  let cmd = 'dbQuery'
  let query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
  'FROM video ' +
  'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
  "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
  "LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') " +
  'ORDER BY date_added DESC LIMIT 5'
  return (dispatch) => {
    ZeroFrame.cmd(cmd, [query], (data) => {
      return dispatch({
        type: types.GET_VIDEOS,
        videos: data
      })
    })
  }
}

export function searchVideos (search) {
  let cmd = 'dbQuery'
  let query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
  'FROM video ' +
  'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
  "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
  "LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') " +
  "WHERE title LIKE '%" + search + "%' OR description LIKE '%" + search + "%'" +
  'ORDER BY date_added DESC LIMIT 5'
  return (dispatch) => {
    ZeroFrame.cmd(cmd, [query], (data) => {
      return dispatch({
        type: types.GET_VIDEOS,
        videos: data
      })
    })
  }
}

export function getVideosByUser (zeroID) {
  let cmd = 'dbQuery'
  let query = 'SELECT video.*, user.value AS user_name, user_json_content.directory AS user_address ' +
  'FROM video ' +
  'LEFT JOIN json AS user_json_data ON (user_json_data.json_id = video.json_id) ' +
  "LEFT JOIN json AS user_json_content ON (user_json_content.directory = user_json_data.directory AND user_json_content.file_name = 'content.json') " +
  "LEFT JOIN keyvalue AS user ON (user.json_id = user_json_content.json_id AND user.key = 'cert_user_id') " +
  "WHERE user_name = '" + zeroID + "' ORDER BY date_added DESC"
  return (dispatch) => {
    ZeroFrame.cmd(cmd, [query], (data) => {
      return dispatch({
        type: types.GET_VIDEOS,
        videos: data
      })
    })
  }
}

export function loadMore (videos) {
  return {
    type: types.LOAD_MORE,
    videos
  }
}
