import { types } from "Store/reducers/user";

const stateKey = "user";

export const INIT_USER = payload => {
    return {
        type: types.INIT_USER,
        stateKey: [stateKey],
        payload,
    };
}