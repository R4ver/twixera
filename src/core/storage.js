const _cache = {};
const _prefix = "twixera_";
let localStorageSupport = true;

export const init = () => {
    try {
        window.localStorage.setItem('twixera_test', 'Wowee');
        window.localStorage.removeItem('twixera_test');
    } catch (e) {
        localStorageSupport = false;
    }

    ImportSettings();
}

const parseSetting = value => {
    if (value === null) {
        return null;
    } else if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else if (value === '') {
        return '';
    } else if (isNaN(value) === false) {
        return parseFloat(value, 10);
    }

    return value;
};

const ImportSettings = () => {
    if ( get('import_twixera_settings') || !localStorageSupport ) {
        return;
    }

    // Object.keys(window.localStorage)
    //     .filter(id => id.startsWith(_prefix) || id === 'nicknames')
    //     .map(id => {
    //         let value = parseSetting(window.localStorage.getItem(id));

    //         if (id === 'nicknames') {
    //             value = JSON.parse(value);
    //         }

    //         id = id.split(_prefix)[1] || id;

    //         return {
    //             id,
    //             value
    //         };
    //     })
    //     .forEach(setting => set(setting.id, setting.value));

    // Handle old settings

    set('import_twixera_settings', true);
}

export const get = (id, prefix = true) => {
    if ( prefix ) {
        id = _prefix + id;
    }

    if ( id in _cache ) {
        return _cache[id];
    }

    try {
        return JSON.parse(localStorageSupport ? parseSetting(window.localStorage.getItem(id)) : "implement cookie saving");
    } catch (e) {
        return null;
    }
}

export const set = (id, value, prefix = true, emit = true, cache = true) => {
    let storageId = id;

    if ( prefix ) {
        storageId = _prefix + id;
    }

    if ( cache ) {
        _cache[storageId] = value
    }

    // Implement emit

    value = JSON.stringify(value);

    return localStorageSupport ? (
        window.localStorage.setItem(storageId, value)
    ) : (
        "Implement cookie saving"
    );
}

export const del = (id, prefix = true, emit = true) => {
    let storageId = id;

    if (prefix) {
        storageId = _prefix + id;
    }

    delete _cache[storageId];

    return localStorageSupport ? (
        window.localStorage.removeItem(storageId)
    ) : (
        "Implement cookie saving"
    );
}

export const getStorage = () => {
    const storage = {};

    if ( !localStorageSupport ) {
        return storage;
    }

    Object.keys(window.localStorage)
        .filter(id => id.startsWith(_prefix))
        .forEach(id => {
            storage[id] = get(id, null);
        });

    return storage;
}