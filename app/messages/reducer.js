import { UPDATE_MESSAGES } from './constants';

const initialState = [];

export default function site(state=initialState, action) {

  switch (action.type) {
    case UPDATE_MESSAGES:
      return Object.assign([], state, action.messages);
    default:
      return state;
  }
}
