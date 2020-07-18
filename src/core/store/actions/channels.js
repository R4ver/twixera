import { types } from "Store/reducers/channels";

const stateKey = "channels";

export const SET_CHANNEL = payload => ({
    type: types.SET_CHANNEL,
    stateKey: [stateKey],
    payload
})

export const ADD_CHANNEL = payload => ({
    type: types.ADD_CHANNEL,
    stateKey: [stateKey],
    payload
})

export const CLEAR_CHANNELS = () => ({
    type: types.CLEAR_CHANNELS,
    stateKey: [stateKey]
})