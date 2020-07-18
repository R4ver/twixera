import {
    createReducer
} from "./index";
import Log from "Core/utils/log";

export const types = {
    SET_LOCATION: "SET_LOCATION"
}

const setLocation = (state, {
    payload: {
        pathname,
        search,
        hash
    }
}) => {
    state = {
        ...state,
        previous: state.current,
        current: {
            pathname,
            search,
            hash
        }
    }

    return state;
}

const locationReducer = createReducer({}, {
    SET_LOCATION: setLocation
});

export default locationReducer;
