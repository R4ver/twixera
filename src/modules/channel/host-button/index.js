import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { waitForElement } from "Core/helpers/elementLoading";
import Log from "Core/utils/log";
import { Button } from "UI";

const FOLLOW_BUTTON_CONTAINER = ".follow-btn__follow-notify-container div";

const ChannelHostButton = () => {
    const [hostState, setHostState] = useState({
        isHostingChannel: false,
        hostOtherChannelName: "",
        parentContainer: null
    })

    useEffect( () => {
        (async () => {
            try {
                const elem = await waitForElement(FOLLOW_BUTTON_CONTAINER);
                
                if ( elem ) {
                    setHostState(prev => ({
                        ...prev,
                        parentContainer: elem
                    }))
                }
            } catch (error) {
                Log.error("Couldn't get parent element to inject host button", error);
            }

        })()
    }, [])

    const handleHost = () => {
        console.log("Implement host functionality");
    }

    if ( !hostState.parentContainer ) return null;

    return createPortal(
        <Button onClick={handleHost}>
            {!hostState.isHostingChannel ? (
                <span className="tw-core-button-label tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--secondary tw-full-width tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                    Host channel
                </span>
            ) : (
                <span className="tw-core-button-label tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--secondary tw-full-width tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative">
                    Unhost channel
                </span>
            )}
        </Button>,
        hostState.parentContainer
    );
}

ChannelHostButton.settings = [
    {
        id: "host_button",
        name: "Channel host button",
        description: "Adds a button to host the current channel you are watching.",
        category: "channel",
        defaultValue: false,
        type: "toggle",
        disabled: false
    },
];

export default ChannelHostButton;