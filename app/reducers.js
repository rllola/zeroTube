import { combineReducers } from 'redux';
import site from './site/reducer';
import messages from './messages/reducer';


const rootReducer = combineReducers({
  messages,
  site
});

export default rootReducer;
