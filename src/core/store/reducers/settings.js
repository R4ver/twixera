import {
    createReducer
} from "./index";
import { getSetting, setSetting } from "Core/settings";
import Log from "Core/utils/log";

export const types = {
    INIT_SETTINGS: "INIT_SETTINGS",
    UPDATE_SETTING: "UPDATE_SETTING",
    SET_SETTINGS_PATH: "SET_SETTINGS_PATH",
};

const initSettings = (state, {
    payload
}) => {
    Log.debug("ADD INITIAL SETTINGS: ", payload);
    payload.forEach(setting => {
        const {
            id,
            name,
            description,
            category,
            childSettings,
            soon = false,
            values = [],
            defaultValue,
            editable = true,
            auth = false,
            disabled = false,
            type,
            messageParserCheck,
        } = setting;

        if (id in state) {
            throw new Error(`${id} is already a defined setting.`);
        }

        if (disabled) {
            updateSetting(state, {payload: {
                id,
                value: false
            }});
        }

        const active = 
                getSetting(id) &&
                getSetting(id) !== undefined && 
                getSetting(id) !== null &&
                getSetting(id) !== ""
                    ? true : false;

        const value = getSetting(id) || defaultValue;

        state = {
            ...state,
            [id]: {
                id,
                active,
                name,
                description,
                category,
                soon,
                active,
                value,
                values,
                defaultValue,
                childSettings,
                editable,
                auth,
                disabled,
                type,
                messageParserCheck: messageParserCheck,
            },
        };
    })


    Log.debug("Settings Initialized");

    return state;
}

const updateSetting = (state, {payload: {id, value}}) => {
    setSetting(id, value);

    const active =
        getSetting(id) &&
        getSetting(id) !== undefined &&
        getSetting(id) !== null &&
        getSetting(id) !== ""
            ? true
            : false;

    state = {
        ...state,
        [id]: {
            ...state[id],
            value,
            active
        },
    };

    return state;
}

const setSettingsPath = (state, { payload }) => {
    return {
        ...state,
        pathname: payload !== "" ? payload : "dashboard"
    }
}

const settingsReducer = createReducer({}, {
    INIT_SETTINGS: initSettings,
    UPDATE_SETTING: updateSetting,
    SET_SETTINGS_PATH: setSettingsPath
});

export default settingsReducer;
