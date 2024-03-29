import { types } from "Store/reducers/twixera";

const stateKey = "twixera";

export const SET_ENV = payload => ({
    type: types.SET_ENV,
    stateKey,
    payload
})

export const SET_MODULE_CONTEXT = payload => ({
    type: types.SET_MODULE_CONTEXT,
    stateKey: [stateKey, "module_context"],
    payload
})

export const SET_EMOTES = payload => ({
    type: types.SET_EMOTES,
    stateKey: [stateKey],
    payload
})

export const SET_ROUTER = payload => ({
    type: types.SET_ROUTER,
    stateKey: [stateKey, "router"],
    payload
})