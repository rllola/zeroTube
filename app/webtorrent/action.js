import * as types from './constants'

export function updateInfo (info) {
  return {
    type: types.UPDATE_INFO,
    info
  }
}
