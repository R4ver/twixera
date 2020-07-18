import React, { useEffect, useContext, useState } from "react";
import { getRouter } from "Core/utils/twitch";
import { SET_ROUTER } from "Core/store/actions/twixera";
import Log from "Core/utils/log";

import { store } from "Core/store";

import RouteWatcher from "Core/components/watchers/RouteWatcher";
import { GlobalModuleLoader, ModuleLoader } from "Core/ModuleLoader";

const App = () => {
    const [state, dispatch] = useContext(store);
    const [hasRouter, setHasRouter] = useState(false);

    useEffect( () => {
        (async () => {
            try {
                const router = await getRouter();
                
                if ( router ) {
                    dispatch(SET_ROUTER(router))
                    setHasRouter(true);
                } else {
                    setHasRouter(false);
                }
            } catch (error) {
                Log.error(error);
                setHasRouter(false);
            }
        })()
    }, [])

    if ( !hasRouter ) return null;

    return <>
        <RouteWatcher />
        <GlobalModuleLoader />
        <ModuleLoader />
    </>;
}

export default App;