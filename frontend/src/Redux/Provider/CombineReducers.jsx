import { combineReducers } from "redux"

import UserReducer from '../Reducers/UserReducer';

const RootReducer = combineReducers({ UserReducer })

export default RootReducer