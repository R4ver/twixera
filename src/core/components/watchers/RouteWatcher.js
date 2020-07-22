import { useEffect, useRef } from "react";
import { useStore } from "Store";
import { moduleGroups } from "Core/ModuleLoader";
import Log from "Core/utils/log";
import { waitForLoad } from "Core/helpers/elementLoading";
import { getCurrentChannel } from "Core/utils/twitch";

import { SET_LOCATION } from "Store/actions/location";
import { SET_CHANNEL } from "Store/actions/channels";
import { SET_MODULE_CONTEXT } from "Store/actions/twixera";

const routes = {
    HOMEPAGE: "HOMEPAGE",
    DIRECTORY_FOLLOWING_LIVE: "DIRECTORY_FOLLOWING_LIVE",
    DIRECTORY_FOLLOWING: "DIRECTORY_FOLLOWING",
    DIRECTORY: "DIRECTORY",
    CHAT: "CHAT",
    CHANNEL: "CHANNEL",
    CHANNEL_SQUAD: "CHANNEL_SQUAD",
    DASHBOARD: "DASHBOARD",
    VOD: "VOD",
};

const routeKeysToPaths = {
    [routes.HOMEPAGE]: /^\/$/i,
    [routes.DIRECTORY_FOLLOWING_LIVE]: /^\/directory\/following\/live$/i,
    [routes.DIRECTORY_FOLLOWING]: /^\/directory\/following$/i,
    [routes.DIRECTORY]: /^\/directory/i,
    [routes.CHAT]: /^(\/popout)?\/[a-z0-9-_]+\/chat$/i,
    [routes.VOD]: /^(\/videos\/[0-9]+|\/[a-z0-9-_]+\/clip\/[a-z0-9-_]+)$/i,
    [routes.DASHBOARD]: /^(\/[a-z0-9-_]+\/dashboard|\/u\/[a-z0-9-_]+\/stream-manager)/i,
    [routes.CHANNEL_SQUAD]: /^\/[a-z0-9-_]+\/squad/i,
    [routes.CHANNEL]: /^\/[a-z0-9-_]+/i,
};

function getRouteFromPath(path) {
    for (const name of Object.keys(routeKeysToPaths)) {
        const regex = routeKeysToPaths[name];
        if (!regex.test(path)) continue;
        return name;
    }

    return null;
}

const RouteWatcher = () => {
    const [state, dispatch] = useStore();
    let previousPath = useRef(state.location.previous.pathname);

    useEffect( () => {
        if ( !state.twixera.router ) return;

        state.twixera.router.history.listen((location) => {
            if ( location.pathname === previousPath.current ) return;

            dispatch(SET_LOCATION(location));
        });

        dispatch(SET_LOCATION(state.twixera.router.history.location));
    }, [state.twixera.router.history.location.pathname])

    useEffect(() => {
        previousPath.current = state.location.previous.pathname;
        const path = state.location.current.pathname;
        const route = getRouteFromPath(path);



        (async () => {
            let channel;

            switch (route) {
                case routes.BROWSE_FOLLOWING:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route]]))
                    break;
                case routes.BROWSE_GAMES:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route]]))
                    break;
                case routes.BROWSE_GAME:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route]]))
                    break;
                case routes.CHAT:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route]]))

                    waitForLoad("channel").then(() => {
                        const currentChannel = getCurrentChannel();
                        dispatch(SET_CHANNEL(currentChannel));
                    });
                    break;
                case routes.VOD:
                    // Make sure chat emotes n shit works here at some point lol
                    break;
                case routes.CHANNEL:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route], moduleGroups.CHAT]))
                    
                    waitForLoad("channel").then( () => {
                        const currentChannel = getCurrentChannel();
                        dispatch(SET_CHANNEL(currentChannel));
                    });
                    break;
                case routes.HOMEPAGE:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route]]))
                    break;
                case routes.DASHBOARD:
                    dispatch(SET_MODULE_CONTEXT([moduleGroups[route],  moduleGroups.CHAT]))
                    
                    waitForLoad("chat").then(() => {
                        const currentChannel = getCurrentChannel();
                        dispatch(SET_CHANNEL(currentChannel));
                    });
                    break;
                default: 
                    dispatch(SET_MODULE_CONTEXT([]));
                break;
            }
        })()        
    }, [state.location.current])

    return null;
}

export default RouteWatcher;