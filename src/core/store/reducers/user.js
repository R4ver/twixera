import { createReducer, combineReducers } from "./index";
import Log from "Core/utils/log";

export const types = {
    INIT_USER: "INIT_USER"
}

const initUser = (state, {payload}) => {
    if ( !payload.id ) {
        Log.error("User init payload didn't have a user id");
        return state;
    }

    state = {
        ...state,
        ...payload
    }

    return state;
}

const userReducer = createReducer({}, {
    INIT_USER: initUser
});

export default userReducer;