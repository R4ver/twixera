import userReducer from "./user";
import channelReducer from "./channels";
import twixeraReducer from "./twixera";
import locationReducer from "./location";
import settingsReducer from "./settings";

const rootReducer = combineReducers({
    user: userReducer,
    channels: channelReducer,
    twixera: twixeraReducer,
    settings: settingsReducer,
    location: locationReducer
});

export default rootReducer;

/**
 * 
 * Helper functions
 * 
 */
export function combineReducers(reducerDict) {
    const _initialState = getInitialState(reducerDict);
    return function (state = _initialState, action) {
        return Object.keys(reducerDict).reduce((acc, curr) => {
            let slice = reducerDict[curr](state[curr], action);
            return {
                ...acc,
                [curr]: slice
            };
        }, state);
    };
}

export function createReducer(initialState, handlers) {
    return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
}

function getInitialState(reducerDict) {
    return Object.keys(reducerDict).reduce((acc, curr) => {
        const slice = reducerDict[curr](undefined, {
            type: undefined
        });
        return {
            ...acc,
            [curr]: slice
        };
    }, {});
}