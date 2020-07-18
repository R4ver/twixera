import { types } from "Store/reducers/settings";

const stateKey = "settings";

export const INIT_SETTINGS = payload => ({
    type: types.INIT_SETTINGS,
    stateKey: [stateKey],
    payload
})

export const TOGGLE_SETTING = (id, active) => ({
    type: types.TOGGLE_SETTING,
    stateKey: [stateKey],
    payload: {
        id,
        active
    }
})

export const SET_SETTINGS_PATH = payload => ({
    type: types.SET_SETTINGS_PATH,
    stateKey: [stateKey],
    payload
})