import * as types from './constants';

export function updateMessages(messages) {
  return {
    type: types.UPDATE_MESSAGES,
    messages
  };
}
