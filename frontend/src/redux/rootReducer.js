import { combineReducers } from 'redux';
import userReducer from './userSlice';
import chatReducer from './chatSlice';

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;
