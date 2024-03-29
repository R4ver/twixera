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
        let TwixeraModules = [];
        modules
            .keys()
            .filter((i) => !i.match(/^modules/))
            .map((item) => {
                item = item.replace("./", "");
                const context = /^(\w+)\//.exec(item)[1];
                if (context === "global") return;
                let module = require(`../modules/${item}`).default;

                if (module && module.settings) {
                    module.settings.forEach(addSetting);
                } else {
                    throw new Error(
                        `Module, ${module.name} does not have any settings. All modules require basic info of id, name and category.`
                    );
                }

                if (module && module.setup) {
                    module.setup(state, dispatch);
                }

                if (module) {
                    TwixeraModules[context] = [
                        ...(TwixeraModules[context] || []),
                        module,
                    ];
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
    console.log(modules);
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
        let TwixeraModules = [];
        modules
            .keys()
            .filter((i) => !i.match(/^modules/))
            .map((item) => {
                item = item.replace("./", "");
                let module = require(`../modules/global/${item}`).default;
                console.log(item, module);

                if (module && module.settings) {
                    module.settings.forEach(addSetting);
                }

                if (module && module.setup) {
                    module.setup(state, dispatch);
                }

                if (module) {
                    TwixeraModules = [...TwixeraModules, module];
                }
            });
        
        // dispatch(INIT_SETTINGS(getSettings()));
        setModules((prev) => ([
            ...prev,
            ...TwixeraModules,
        ]));
    }, []);

    // Log.log("Module state", modules);
    // Log.log("Current app state: ", state);
    const renderedModules = modules.map((Component, index) => {
        if ( Component.settings ) {
            const active = state.settings[Component.settings[0].id].active;
            if ( !active ) return null;
            
            return <Component key={index} />;
        } else {
            return <Component key={index} />;
        }
    }).filter(e => e !== undefined && e !== null);

    Log.info("Twixer global modules: ", modules);
    Log.info("Loaded global modules", renderedModules);

    return <>{renderedModules}</>;
};