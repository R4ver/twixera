import { useReducer, useRef, useMemo, useCallback } from "react";
import Log from "Core/utils/log";

const enableLogger = process.env.NODE_ENV === "development";

const useReducerStore = (rootReducer, initialState = {}) => {
    const [ state, dispatch ] = useReducer(rootReducer, initialState);

    const preState = useRef({ state: {}, actions: [] });

    const dispatchWithLogging = useCallback((action) => {
        if (typeof action === "function") {
            return action(dispatchWithLogging, () => preState.current.state);
        }

        const actionType = typeof action === "object" ? action.type : action;

        preState.current.actions = preState.current.actions || [];
        preState.current.actions.push({
            actionType,
            action,
            state: getStateByKeys(preState.current.state, action.stateKey),
        });

        dispatch(action);
    }, []);

    const customDispatch = enableLogger ? dispatchWithLogging : dispatch;

    const getStateByKeys = (state, keys) => {
        let returnState = state;

        if ( returnState && keys.length > 1 ) {
            keys.forEach(key => {
                returnState = returnState[key];
            })
            return returnState;
        }

        return state ? state[keys[0]] : undefined;
    }

    useMemo(
        function logStateAfterChange() {
            if (!enableLogger || !preState.current) return;

            for (let i = 0; i < preState.current.actions.length; i++) {
                const {
                    actionType,
                    state: previousState,
                    action,
                } = preState.current.actions[i];

                const newState = getStateByKeys(state, action.stateKey);

                const tableArray = [
                    {_id: `Action: ${actionType}`},
                    {_id: "Previous State", ...previousState}, 
                    {_id: "New State", ...newState}
                ]
                const transformed = tableArray.reduce((acc, {_id, ...x}) => { acc[_id] = x; return acc}, {})
   
                Log.debug({
                    actionType,
                    affectedKey: action.stateKey,
                    action,
                    differences: console.table(transformed),
                    rawState: state,
                });

            }

            preState.current.actions = [];
        },
        [state, enableLogger]
    );

    preState.current = { ...preState.current, state };

    return [state, customDispatch];
}

export default useReducerStore;