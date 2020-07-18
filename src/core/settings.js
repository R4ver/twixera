import * as storage from "Core/storage";

const settings = {};

export const setSetting = (id, value) => {
    const setting = storage.set(id, value)
    return setting;
}

export const getSetting = id => {
    const value = storage.get(id);

    if ( value !== null ) {
        return value;
    }

    const setting = settings[id];
    return setting ? setting.defaultValue : null;
}

export const removeSetting = (id, prefix = true, emit = true) => {
    if ( prefix ) {
        storage.del(id);
    } else {
        storage.del(id, false)
    }
}

export const addSetting = ({
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
    disabled = false
}) => {

    if (id in settings) {
        throw new Error(`${id} is already a defined setting.`);
    }

    if ( disabled ) {
        setSetting(id, false);
    }

    settings[id] = {
        id,
        name,
        description,
        category,
        soon,
        values,
        defaultValue,
        childSettings,
        editable,
        auth,
        disabled
    };
}

export const getSettings = () => {
    return Object.values(settings)
        .map(setting => Object.assign({
            value: getSetting(setting.id)
        }, setting));
}