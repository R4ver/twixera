import {
    createReducer
} from "./index";
import { getSetting, setSetting } from "Core/settings";
import Log from "Core/utils/log";

export const types = {
    INIT_SETTINGS: "INIT_SETTINGS",
    TOGGLE_SETTING: "TOGGLE_SETTING",
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
            values = null,
            defaultValue,
            editable = true,
            auth = false,
            disabled = false,
            value
        } = setting;

        if (id in state) {
            throw new Error(`${id} is already a defined setting.`);
        }

        if (disabled) {
            toggleSetting(state, {
                id,
                value: false
            });
        }

        const active = getSetting(id) !== undefined ? getSetting(id) : defautValue;

        state = {
            ...state,
            [id]: active,
            [`${id}_ui`]: {
                id,
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
            },
        };
    })


    Log.debug("Settings Initialized");

    return state;
}

const toggleSetting = (state, {payload: {id, active}}) => {
    setSetting(id, active);
    state = {
        ...state,
        [id]: active,
        [`${id}_ui`]: {
            ...state[`${id}_ui`],
            active,
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
    TOGGLE_SETTING: toggleSetting,
    SET_SETTINGS_PATH: setSettingsPath
});

export default settingsReducer;
