import { types } from "Store/reducers/settings";

const stateKey = "settings";

export const INIT_SETTINGS = payload => ({
    type: types.INIT_SETTINGS,
    stateKey: [stateKey],
    payload
})

export const UPDATE_SETTING = (id, value) => ({
    type: types.UPDATE_SETTING,
    stateKey: [stateKey],
    payload: {
        id,
        value
    }
})

export const SET_SETTINGS_PATH = payload => ({
    type: types.SET_SETTINGS_PATH,
    stateKey: [stateKey],
    payload
})