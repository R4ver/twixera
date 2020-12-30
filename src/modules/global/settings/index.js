import React, { useEffect, useState, useRef } from "react";
import { waitForElement } from "Core/helpers/elementLoading";
import Log from "Core/utils/log";
import { useStore } from "Store";

import SettingsWindow from "./settings-window";
import { PrependPortal } from "UI";

const contexts = {
    chat: ".stream-chat-header div:first-child",
    dashboard: `[data-a-target="user-menu-toggle"]`,
    modDash: `[data-highlight-selector="mode-management"]`,
    default: ".top-nav__prime",
};

const changeLogUrl = "https://r4ver.com/twixera/news";

const TwixeraSettings = () => {
    const [{twixera: { module_context }}] = useStore();
    const [buttonRoot, setButtonRoot] = useState({
        button: null,
        className: []
    });
    let portalClass = useRef([]);
    const [showSettings, setShowSettings] = useState(false);
    const [news, setNews] = useState("");

    useEffect( () => {
        ( async () => {
            const contextKey = module_context[0];
            let button = null;
            let className = []
            switch (contextKey) {
                case "dashboard":
                    console.log("We at dashboard");
                    button = await getElem(contexts[contextKey]);
                    button = button.parentElement.parentElement.parentElement.firstElementChild;
                    button.style.marginLeft = "1rem";
                    break;

                case "chat":
                    button = await getElem(contexts[contextKey]);
                    className = ["tw-absolute", "tw-left-0"];
                    break;

                case "modDash":
                    button = await getElem(contexts[contextKey])
                    break;
            
                default:
                    button = await getElem(contexts.default)
                    break;
            }

            setButtonRoot({
                button,
                className
            });
        })()
    }, [module_context])

    const getElem = async (key) => {
        try {
            let rootButton = null;
            rootButton = await waitForElement(key);

            if (rootButton) {
                return rootButton;
            }
        } catch (error) {
            Log.error("Couldn't get settings button root element: ", error);
        }
    }

    useEffect(() => {
        if (news !== "") return;

        (async () => {
            const markdown = await (await fetch(changeLogUrl)).text();

            if (markdown) {
                setNews(markdown);
            }
        })();
    }, []);

    const toggleShowSettings = () => {
        setShowSettings(!showSettings);
    }

    if ( !buttonRoot.button ) return null;

    return (
        <>
            <PrependPortal root={buttonRoot.button} className={buttonRoot.className}>
                <button
                    className="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
                    onClick={toggleShowSettings}
                >
                    <img
                        className="tw-button-icon__icon"
                        style={{ width: "2rem", height: "2rem" }}
                        src={process.env.NODE_ENV === "development" ? "https://r4ver.com/twixera/assets/twixera-logo-dev.svg" : "https://r4ver.com/twixera/assets/twixera-logo.svg"}
                    />
                </button>
            </PrependPortal>

            {showSettings && (
                <SettingsWindow closeSettings={toggleShowSettings} news={news} />
            )}
        </>
    );
}



export default TwixeraSettings;
