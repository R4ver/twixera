import { createReducer } from "./index";
import Log from "Core/utils/log";

export const types = {
    SET_ENV: "SET_ENV",
    SET_MODULE_CONTEXT: "SET_MODULE_CONTEXT",
    SET_EMOTES: "SET_EMOTES",
    SET_ROUTER: "SET_ROUTER",
    SET_HAS_BTTV: "SET_HAS_BTTV",
    SET_HAS_FFZ: "SET_HAS_FFZ"
}

const setEnvironment = (state, {payload}) => {
    if ( payload !== "online" && payload !== "offline") {
        Log.error(`Parsed wrong payload format to SET_ENV. Expects either "online" or "offline"`);
        return state;
    }

    state = {
        ...state,
        env: payload
    }

    return state;
}

const setModuleContext = (state, {payload}) => {
    if ( !Array.isArray( payload ) ) {
        Log.error(`Parsed wrong payload format to SET_MODULE_CONTEXT. Expects an array and was given`, typeof payload);
        return state;
    }

    state = {
        ...state,
        module_context: payload
    }

    return state;
}

const setEmotes = (state, { payload }) => ({
    ...state,
    emotes: [...payload],
});

const setRouter = (state, { payload }) => ({
    ...state,
    router: payload,
});

const setHasBTTV = (state, { payload }) => ({
    ...state,
    hasBTTV: payload
})

const setHasFFZ = (state, { payload }) => ({
    ...state,
    hasFFZ: payload,
});

const twixeraReducer = createReducer({}, {
    SET_ENV: setEnvironment,
    SET_MODULE_CONTEXT: setModuleContext,
    SET_EMOTES: setEmotes,
    SET_ROUTER: setRouter,
    SET_HAS_BTTV: setHasBTTV,
    SET_HAS_FFZ: setHasFFZ
});

export default twixeraReducer;