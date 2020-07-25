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

const isActive = (id, childId = null) =>
    getSetting(id, childId) &&
    getSetting(id, childId) !== undefined &&
    getSetting(id, childId) !== null &&
    getSetting(id, childId) !== "" ?
    true : false;

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
            type
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

        if ( childSettings ) {
            childSettings.forEach(e => {
                e.value = getSetting(id, e.id) || e.defaultValue;
                e.active = isActive(id, e.id);
            })
        }

        const value = getSetting(id) || defaultValue;
        const active = isActive(id);

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
                type
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
