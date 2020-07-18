import { types } from "Store/reducers/location";

const stateKey = "location";

const SET_LOCATION = payload => ({
    type: types.SET_LOCATION,
    stateKey: [stateKey, "current"],
    payload
});

export {
    SET_LOCATION
}