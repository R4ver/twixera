/**
 * These functions helps waiting for an element to load or wait for it to be visible
 * 
 * waitForLoad is generally used when a required element is known to be present,
 * but we gotta wait for it before continuing
 * 
 * wait
 */
import { initialize, deinitialize } from 'Core/utils/initialize';
import { getCurrentChannel, getCurrentChat } from "Core/utils/twitch";

const loadPredicates = {
    // following: () => !!$('.tw-tabs div[data-test-selector="ACTIVE_TAB_INDICATOR"]').length,
    channel: () => {
        const currentChannel = getCurrentChannel();
        if ( !currentChannel || !currentChannel.id ) return false;
        return !!currentChannel !== null;
    },
    chat: context => {
        if (!getCurrentChannel()) return false;

        // if (!$(CHAT_ROOM_SELECTOR).length) return false;

        const lastReference = currentChatReference;
        const currentChat = getCurrentChat();
        if (!currentChat) return false;

        let checkReferences = true;
        if (context && context.forceReload) {
            if (context.checkReferences === undefined) {
                context.checkReferences = true;
            }
            checkReferences = context.checkReferences;
            context.checkReferences = false;
        }

        if (checkReferences) {
            if (currentChat === lastReference) return false;
            if (currentChat.props.channelID === currentChatChannelId) return false;
        }

        let currentChatReference = currentChat;
        let currentChatChannelId = currentChat.props.channelID;

        return true;
    },
    // clips: () => twitch.updateCurrentChannel(),
    // player: () => !!twitch.getCurrentPlayer(),
    // vod: () => twitch.updateCurrentChannel() && $('.video-chat__input textarea').length,
    // vodRecommendation: () => $(CANCEL_VOD_RECOMMENDATION_SELECTOR).length,
    // homepage: () => !!$('.front-page-carousel .video-player__container').length
};

export const waitForLoad = (type, context) => {
    let timeout;
    let interval;
    return Promise.race([
        new Promise((resolve) => {
            timeout = setTimeout(resolve, 10000);
        }),
        new Promise((resolve) => {
            const loaded = loadPredicates[type];
            if (loaded(context)) {
                resolve();
                return;
            }
            interval = setInterval(() => loaded(context) && resolve(), 25);
        })
    ]).then((elem) => {
        clearTimeout(timeout);
        clearInterval(interval);
        return elem;
    });
}

export const waitForElement = selector => {

    let promise = new Promise(resolve => {
        deinitialize(selector);

        initialize(selector, () => {
            deinitialize(selector);
            let elem = document.querySelector(selector);
            if (elem) {
                resolve(elem);
            }
        });
    });

    return promise;
}