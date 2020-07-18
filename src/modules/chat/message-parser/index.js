import React, { useEffect } from "react";
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
                    const msgObject = getChatMessageObject(elem);
                    parseMessage(elem, msgObject);
                });
            }
        );

        return () => {
            deinitialize(`[class^=chat-line__message]`);
        };
    }, [state.channels]);

    const parseMessage = (elem, msgObject) => {
        if (!elem || !msgObject) return;

        const { badges, user } = msgObject;

        const removeBadges = new CustomEvent("twixera-remove-message-badges", {
            detail: {
                elem
            },
        });
        document.dispatchEvent(removeBadges);

        if (!elem.querySelector(`twixera-user-avatar-wrapper`)) {
            const event = new CustomEvent("twixera-add-message-avatar", {
                detail: {
                    elem,
                    user,
                    badges,
                },
            });
            document.dispatchEvent(event);
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
