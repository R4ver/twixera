import { createReducer, combineReducers } from "./index";
import Log from "Core/utils/log";

export const types = {
    SET_CHANNEL: "SET_CHANNEL",
    ADD_CHANNEL: "ADD_CHANNEL",
    CLEAR_CHANNELS: "CLEAR_CHANNELS"
}

const setChannel = (state, {payload}) => {
    state = [{...payload}];

    return state;
}

const addChannel = (state, {payload}) => {
    state = [
        ...state,
        {...payload}
    ]

    return state;
}

const clearChannels = (state, action) => {
    state = [];
    return state;
}

const userReducer = createReducer([], {
    SET_CHANNEL: setChannel,
    ADD_CHANNEL: addChannel,
    CLEAR_CHANNELS: clearChannels
});

export default userReducer;