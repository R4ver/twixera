import React, { useEffect, useRef } from "react";
import { waitForElement, waitForLoad } from "Core/helpers/elementLoading";
import { getChatMessageObject, getCurrentChannel } from "Core/utils/twitch";
import { initialize, deinitialize } from "Core/utils/initialize";
import { useStore } from "Store";
import Log from "Core/utils/log";

const avatarCacheKey = "twixera-user-avatar-wrapper";

const MessageParser = () => {
    const [state, dispatch] = useStore();

    useEffect(() => {
        if (!state.channels.length > 0) return;

        waitForElement(`[class^=chat-scrollable-area__message-container]`).then((elem) => {
                if (!elem) return;
                initialize(`[class^=chat-line__message]`, (elem) => {
                    const msgObject = getChatMessageObject(elem) !== undefined ? getChatMessageObject(elem) : getChatMessageObject(elem, true);

                    parseMessage(elem, msgObject);
                });
            }
        );

        return () => {
            deinitialize(`[class^=chat-line__message]`);
        };
    }, [state.channels]);

    const parseMessage = (elem, msgObject) => {
        console.log(elem, msgObject);
        if (!elem || !msgObject) return;

        const { badges, user, messageBody } = msgObject;
        let event;

        switch (msgObject.deleted) {
            case true:
                event = new CustomEvent("twixera-deleted-message", {
                    detail: {
                        elem,
                        user,
                        messageBody,
                        rawMessage: msgObject,
                    },
                });
                Log.debug("Deleted message: ", {
                    elem,
                    msgObject,
                });
                document.dispatchEvent(event);
                break;
        
            default:
                event = new CustomEvent("twixera-new-message", {
                    detail: {
                        elem,
                        user,
                        badges,
                        rawMessage: msgObject,
                    },
                });

                Log.debug("New chat message: ", {
                    elem,
                    msgObject,
                });
                document.dispatchEvent(event);
                break;
        }
        
    };
    return null;
};

MessageParser.settings = [
    {
        id: "message_parser",
        category: "chat",
        defaultValue: true,
        editable: false
    },
];

export default MessageParser;
