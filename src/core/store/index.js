import React, { createContext, useEffect, useContext} from "react";
import useReducerStore from "Core/hooks/useReducerStore";
import rootReducer from "Store/reducers";
import Log from "Core/utils/log";
import * as storage from "Core/storage";
import { getConnectStore, REACT_ROOT } from "Core/utils/twitch";
import { waitForElement } from "Core/helpers/elementLoading";

import { INIT_USER } from "Store/actions/user";
import { SET_LOCATION } from "Store/actions/location";
import { SET_ENV } from "Store/actions/twixera";

const {
    pathname,
    search,
    hash,
    href
} = window.location;
const initialSate = {
    user: {},
    channels: [],
    location: {
        previous: {},
        current: {
            pathname,
            search,
            hash,
            href
        }
    },
    settings: {},
    twixera: {
        env: "",
        emotes: [],
        module_context: []
    }
};
const store = createContext(initialSate);
const { Provider } = store;

const StateProvider = ( { children } ) => {
    const [state, dispatch] = useReducerStore(rootReducer, initialSate);

    const updateLoaction = () => {
        const {
            pathname,
            search,
            hash,
            href
        } = window.location;
        dispatch(SET_LOCATION({
            pathname,
            search,
            hash,
            href
        }))
    }

    useEffect( () => {
        storage.init();
        console.log("Initializing storage");

        // let pushState = history.pushState;
        // history.pushState = function () {
        //     pushState.apply(history, arguments);
        //     updateLoaction(); // Some event-handling function
        // };

        // window.addEventListener("popstate", updateLoaction);
    }, [])

    useEffect(() => {
        // Perform check if there's a user logged in
        // and if, update
       (async () => {
           
           try {
                await waitForElement(REACT_ROOT);

                const connectStore = getConnectStore();
                if (!connectStore) {
                    Log.error("Initialization failed, missing : ", {
                        connectStore,
                    });
                    return;
                }
                const user = connectStore.getState().session.user;

                waitForElement(`[data-a-target='top-nav-avatar'] img`).then( elem => {    
                    dispatch(INIT_USER({
                        id: user.id,
                        displayName: user.displayName,
                        avatar: elem.src,
                        authToken: user.authToken,
                        login: user.login, 
                    }))
                });
                
            } catch (error) {
                dispatch(SET_ENV("offline"));
                Log.error("Failed to get user. Probably offline: ", error);
            }          
       })()
    }, [])

    return <Provider value={[ state, dispatch ]}>{children}</Provider>;
};

const useStore = () => useContext(store);

export { store, StateProvider, useStore };