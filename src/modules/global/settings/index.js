import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { waitForElement } from "Core/helpers/elementLoading";
import Log from "Core/utils/log";

import SettingsWindow from "./settings-window";
import { PrependPortal } from "UI";

const PRIME_BUTTON_SELECTOR = `.top-nav__prime`;
const MODERATOR_NAV_SECTION = `[data-highlight-selector="mode-management"]`;
const DASHBOARD_NAV_SECTION = `.announcements-icon--green`;

const changeLogUrl = "https://r4ver.com/twixera/news";

const TwixeraSettings = () => {
    const [buttonRoot, setButtonRoot] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [news, setNews] = useState("");

    useEffect( () => {
        (async () => {
            try {
                let rootButton = null;
                rootButton = await waitForElement(PRIME_BUTTON_SELECTOR);

                if ( rootButton ) {
                    setButtonRoot(rootButton);
                }
            } catch (error) {
                Log.error("Couldn't get prime button: ", error);
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            try {
                let rootButton = null;
                rootButton = await waitForElement(MODERATOR_NAV_SECTION);

                if (rootButton) {
                    setButtonRoot(rootButton);
                }
            } catch (error) {
                Log.error("Couldn't get prime button: ", error);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                let rootButton = null;
                rootButton = await waitForElement(DASHBOARD_NAV_SECTION);

                if (rootButton) {
                    rootButton = rootButton.parentElement.parentElement.firstElementChild;
                    rootButton.style.marginLeft = "1rem";

                    setButtonRoot(rootButton);
                }
            } catch (error) {
                Log.error("Couldn't get prime button: ", error);
            }
        })();
    }, []);

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

    if ( !buttonRoot ) return null;

    return (
        <>
            <PrependPortal root={buttonRoot}>
                <button
                    className="tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-core-button tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative"
                    onClick={toggleShowSettings}
                >
                    <img
                        className="tw-button-icon__icon"
                        style={{ width: "2rem", height: "2rem" }}
                        src="https://r4ver.com/twixera/assets/twixera-logo.svg"
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
