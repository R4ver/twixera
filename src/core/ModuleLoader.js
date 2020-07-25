import React, { useContext, useEffect, useState } from "react";
import { store } from "Store";
import Log from "Core/utils/log";

import { getSettings, addSetting } from "Core/settings";

import { INIT_SETTINGS } from "Store/actions/settings";

export const moduleGroups = {
    HOMEPAGE: "discover",
    DIRECTORY_FOLLOWING_LIVE: "following_live",
    DIRECTORY_FOLLOWING: "following",
    DIRECTORY: "browse_categories",
    CHAT: "chat",
    CHANNEL: "channel",
    CHANNEL_SQUAD: "channel_squad",
    DASHBOARD: "dashboard",
    MOD_DASH: "modDash",
    VOD: "vod",
};

export const ModuleLoader = () => {
    const [state, dispatch] = useContext(store);
    const [modules, setModules] = useState({
        general: [],
        chat: [],
        channel: [],
        frontPage: [],
        followingPage: [],
        dashboard: [],
        modDash: []
    });

    useEffect( () => {
        let modules = require.context("../modules", true, /.+index\.js/);
        let TwixeraModules = {};
        modules.keys().map(item => {
            item = item.replace("./", "");
            const context = /^(\w+)\//.exec(item)[1];
            if ( context === "global" ) return;

            let module = require(`../modules/${item}`).default;

            if ( module && module.settings ) {
                console.log(module.settings);
                module.settings.forEach(addSetting)
            }

            if ( module && module.setup ) {
                module.setup(state, dispatch);
            }
            
            if ( module ) {
                TwixeraModules[context] = [
                    ...TwixeraModules[context] || [],
                    module
                ]
            }
        });

        dispatch(INIT_SETTINGS(getSettings()));
        setModules(prev => ({
            ...prev,
            ...TwixeraModules
        }))
    }, [])

    // Log.log("Module state", modules);
    // Log.log("Current app state: ", state);
    const renderedModules = state.twixera.module_context.flatMap( (context) =>
            modules[context] && modules[context].map((Component, index) => {
                const active = state.settings[Component.settings[0].id].active;

                if ( !active ) return null;

                return <Component key={index} />;
            })
    ).filter(e => e !== undefined && e !== null);

    Log.info(`Loaded modules for ${state.twixera.module_context}`, renderedModules);

    return <>
        {renderedModules}
    </>;
}

export const GlobalModuleLoader = () => {
    const [state, dispatch] = useContext(store);
    const [modules, setModules] = useState([]);

    useEffect(() => {
        let modules = require.context("../modules/global", true, /.+index\.js/);
        let moduleSettings = [];
        let TwixeraModules = [];
        modules.keys().map((item) => {
            item = item.replace("./", "");
            const context = /^(\w+)\//.exec(item)[1];
            let module = require(`../modules/global/${item}`).default;

            if (module && module.settings) {
                moduleSettings = [...moduleSettings, ...module.settings];
            }

            if (module && module.setup) {
                module.setup(state, dispatch);
            }

            TwixeraModules.push(module);
        });

        if (moduleSettings.length > 0) {
            dispatch(INIT_SETTINGS(moduleSettings));
        }

        setModules((prev) => ([
            ...prev,
            ...TwixeraModules,
        ]));
    }, []);

    // Log.log("Module state", modules);
    // Log.log("Current app state: ", state);
    const renderedModules = modules.map((Component, index) => <Component key={index} />)

    Log.info("Loaded global modules", renderedModules);

    return <>{renderedModules}</>;
};