/**
 * EQ Watchers
 * Shoutout to BTTV for both inspiring and providing public code!
 */

import { useEffect, useState } from "react";
import { getMixerStore, updateCurrentChannel, getCurrentChat, getChatMessageObject, getReactInstance, searchReactParents } from "Core/utils/mixer";
import { isLive, setIsLive } from "Core/utils/mixer";
import Mixera, { waitForLoad, events } from "Core/utils/mixera";
import { FixLiveNowModal } from "Modules/mixer-live-modal";
import Constellation from 'Core/utils/Constellation';

const CHAT_MESSAGES_SELECTOR = "[class^=ChatMessages__] [class^=scrollWrapper__]"; //"[class^=ChatMessages__] [class^=scrollWrapper__]";

let channelId;
let router;
let currentPath = '';
let currentRoute = '';
let chatWatcher;
let chatModalWatcher;
let vodChatWatcher;
let clipsChatWatcher;
let currentChatReference;
let currentChatChannelId;
let currentChannelId;
let channel = {};
let globalChannelEventListener;
let lastPath;
let lastRoute;
let isCheckingRoute = false;
let hasSetupForceHistoryHandler = false;
let emotesLoaded = false;

let WatcherLoaded = false;

Mixera.on("mixera.emotes.loaded", () => emotesLoaded = true);

window.displayWatcherVariables = () => console.log({
    channelId,
    router,
    currentPath,
    currentRoute,
    chatWatcher,
    vodChatWatcher,
    clipsChatWatcher,
    currentChatReference,
    currentChatChannelId,
    currentChannelId,
    channel,
    lastPath,
    lastRoute,
    isCheckingRoute
})

const loadPredicates = {
    following: () => document.body.contains(document.querySelector("b-following")),
    channel: () => {
        const channelPage = document.querySelector("b-channel-page-wrapper");

        const currentChannel = updateCurrentChannel();
        if (!currentChannel || !currentChannel.id || (currentChannelId && currentChannelId === currentChannel.id)) return false;
        
        channel = currentChannel;
        currentChannelId = currentChannel.id;
        return !!channelPage;
    },
    chat: context => {

        if (!updateCurrentChannel()) return false;
        if (!document.body.contains(document.querySelector("[class*=chatContainer__] [class^=scrollWrapper__]"))) return false;
        
        const currentChat = getCurrentChat();
        if (!currentChat) return false;
        if (!currentChat && !currentChat.onLoadSuccess) return false

        if ( !emotesLoaded ) return false;

        currentChatReference = currentChat;
        currentChatChannelId = currentChat.props.channelId;
        return true;
    },
    games: () => document.querySelector("b-games-page"),
    game: () => document.querySelector("b-game-page"),
    // clips: () => twitch.updateCurrentChannel(),
    player: () => !!twitch.getCurrentPlayer(),
    vod: () => updateCurrentChannel() && $('.video-chat__input textarea').length,
    vodRecommendation: () => $(CANCEL_VOD_RECOMMENDATION_SELECTOR).length,
    homepage: () => document.body.contains(document.querySelector("b-homepage")),
    global: () => document.body.contains(document.querySelector("b-app .content"))
};

const routes = {
    HOMEPAGE: 'HOMEPAGE',
    BROWSE_FOLLOWING: 'BROWSE_FOLLOWING',
    BROWSE_ALL: 'BROWSE_ALL',
    BROWSE_GAMES: "BROWSE_GAMES",
    BROWSE_GAME: "BROWSE_GAME",
    BROWSE_TEAMS: "BROWSE_TEAMS",
    BROWSE_UP_AND_COMING: "BROWSE_UP_AND_COMING",
    CHAT: 'CHAT',
    CHANNEL: 'CHANNEL',
    DASHBOARD: 'DASHBOARD',
    VOD: 'VOD'
};

const routeKeysToPaths = {
    [routes.HOMEPAGE]: /^\/$/i,
    [routes.BROWSE_FOLLOWING]: /^\/browse\/following$/i,
    [routes.BROWSE_ALL]: /^\/browse\/all$/i,
    [routes.BROWSE_GAMES]: /^\/browse\/games$/i,
    [routes.BROWSE_GAME]: /^\/browse\/games(\/.+)?$/i,
    [routes.BROWSE_TEAMS]: /^\/browse\/teams$/i,
    [routes.BROWSE_UP_AND_COMING]: /^\/browse\/up_and_coming$/i,
    [routes.CHAT]: /^(\/embed)?\/chat\/[a-z0-9-_]+$/i,
    [routes.VOD]: /^([a-z0-9-_]+\?vod=[a-z0-9-_]+)$/i,
    [routes.DASHBOARD]: /^dashboard\/[a-z0-9-_]+\/[a-z0-9-_]+/i,
    [routes.CHANNEL]: /^\/[a-z0-9-_]+/i
};

function getRouteFromPath(path) {
    for (const name of Object.keys(routeKeysToPaths)) {
        const regex = routeKeysToPaths[name];
        if (!regex.test(path)) continue;
        return name;
    }

    return null;
}

const waitForRouteLoad = (type, context = null) => {
    let timeout;
    let interval;
    const startTime = Date.now();
    return Promise.race([
        new Promise( resolve => {
            timeout = setTimeout(resolve, 10000);
        }),
        new Promise( resolve => {
            const loaded = loadPredicates[type];
            if (loaded(context)) {
                resolve();
                return;
            }
            interval = setInterval(() => loaded(context) && resolve(), 25);
        })
    ]).then(() => {
        console.log(`waited for ${type} load: ${Date.now() - startTime}ms`);
        clearTimeout(timeout);
        clearInterval(interval);
    })
    .then(() => Mixera.emit(events.LOAD_GLOBAL));
}

const RouteWatcher = () => {
    const store = getMixerStore();
    const [path, setPath] = useState({pathname: location.pathname});
    useEffect(() => {
        const pathname = (path.pathname.match(/\/me/g) ? window.location.pathname : path.pathname);
        const route = getRouteFromPath(pathname);

        currentRoute = route;
        currentPath = pathname;

        if ( isLive() && route !== routes.CHANNEL ) {
            document.body.classList.add("scrollable");
        } else if ( isLive() && route === routes.CHANNEL ) {
            document.body.classList.remove("scrollable");
        }

        waitForLoad(".eq-nav-link-browse").then( elem => {
            if ( 
                (route === routes.BROWSE_ALL ||
                route === routes.BROWSE_GAMES ||
                route === routes.BROWSE_TEAMS) && 
                elem
            ) {
                elem.classList.add("active");
            } else if ( elem ) {
                elem.classList.remove("active");
            }
        })

        if (currentPath === lastPath) return;

        // Cleanup watcher variables
        currentChatReference = null;
        currentChatChannelId = null;
        currentChannelId = null;

        // Cleanup Channel varibles
        if ( globalChannelEventListener ) {
            globalChannelEventListener.unsub();
            globalChannelEventListener = null;
        }
        channel = null;

        Mixera.emit(events.CLEANUP);

        lastPath = currentPath;
        lastRoute = currentRoute;

        if ( !hasSetupForceHistoryHandler ) {
            Mixera.on(events.FORCED_ROUTE_CHANGE, data => {
                const { previousPage, newPage } = data;

                window.history.pushState({}, null, newPage);
                window.history.pushState({}, null, previousPage);
                setTimeout(() => {
                    window.history.back();
                }, 100);

                window.history.forward();
                setTimeout(() => {
                    window.history.pushState({}, null, previousPage);
                    window.history.pushState({}, null, newPage);
                }, 200);
            });

            hasSetupForceHistoryHandler = true;
        }

        switch (route) {
            case routes.BROWSE_FOLLOWING:
                waitForRouteLoad('following').then(() => Mixera.emit(events.LOAD_BROWSE_FOLLOWING));
                break;
            case routes.BROWSE_GAMES:
                waitForRouteLoad('games').then(() => Mixera.emit(events.LOAD_BROWSE_GAMES));
                break;
            case routes.BROWSE_GAME:
                waitForRouteLoad('game').then(() => Mixera.emit(events.LOAD_BROWSE_GAME));
            break;
            case routes.CHAT:
                waitForRouteLoad('chat').then(() => Mixera.emit(events.LOAD_CHAT));
                break;
            case routes.VOD:
                this.waitForRouteLoad('vod').then(() => this.emit('load.vod'));
                this.waitForRouteLoad('player').then(() => this.emit('load.player'));
                break;
            case routes.CHANNEL:
                waitForRouteLoad('channel').then(() => {
                    Mixera.emit(events.LOAD_CHANNEL)
                    ChannelObserver();z
                });
                waitForRouteLoad('chat').then(() => Mixera.emit(events.LOAD_CHAT));
                break;
            case routes.HOMEPAGE:
                waitForRouteLoad('homepage').then(() => Mixera.emit(events.LOAD_HOMEPAGE));
                break;
            case routes.DASHBOARD:
                this.waitForRouteLoad('chat').then(() => this.emit('load.chat'));
                break;
        }
    }, [path])

    useEffect( () => {
        store.subscribe( () => {
            let pathname = window.location.pathname;

            if ( pathname !== lastPath && !isCheckingRoute && pathname !== "/me/bounceback" ) {
                console.log(store.getState().channelPage.channelId);
                isCheckingRoute = true;
                setPath({
                    pathname: pathname
                });
            } else {
                isCheckingRoute = false;
            }
        })
    }, []);
}

/**
 * Mixer modal functions and observer
 */

const modalPredicates = {
    liveNow: el => {
        if ( 
            el.querySelector("[class^=largeText_]") &&
            el.querySelector("[class^=largeText_]").textContent &&
            el.querySelector("[class^=largeText_]").textContent  === "You are live!"
        ) return true;
    },
    // buyEmbers: el => {
    //     waitForLoad(`.${el.className} [class^=emberContainer_]`).then( elem => {
    //         console.log(elem)
    //         if ( !elem ) return;
    //         return true;
    //     })
    // }
}

const getModalType = el => {
    for ( let type in modalPredicates ) {
        if ( modalPredicates[type](el) ) {
            return type
        }
    }
}

const MixerModalObserver = () => {
    const observe = (watcher, element) => {
        if (!element) return;
        if (watcher) watcher.disconnect();
        watcher.observe(element, {
            childList: true,
            subtree: false
        });
    };

    const modalWatcher = new window.MutationObserver(mutations =>
        mutations.forEach(mutation => {
            const target = mutation.target;

            for (const el of mutation.addedNodes) {
                // Check if message modal was opened
                if (el.className && el.className.match(/backdrop_/)) {
                    const modalType = getModalType(el);
                    switch (modalType) {
                        case "liveNow":
                            FixLiveNowModal(el);
                            break;
                        // case "buyEmbers":
                        //     console.log("We found the embers shop modal");
                        //     break;
                        default:
                            break;
                    }
                }
            }

            // for (const el of mutation.removedNodes) {
            //     if (el.className && el.className.match(/message__.+\sclickable__.+/) && !el.classList.contains("eq-deleted-message")) {
            //         Mixera.emit(events.CHAT_MESSAGE_DELETED, el);
            //     }
            // }
        })
    );

    if ( !WatcherLoaded ) {
        Mixera.on(events.LOAD_GLOBAL, () => observe(modalWatcher, document.body))
    }
}

const ChannelObserver = () => {
    console.log("globalChannelEventListener is currently: ", globalChannelEventListener);
    globalChannelEventListener = new Constellation({
        type: "channel",
        id: channel.id, 
        event: "update"
    });

    globalChannelEventListener.listen(event => Mixera.emit(events.CONSTELLATION_CURRENT_CHANNEL_UPDATES, event));
}

const ChatObserver = () => {
    const emitMessage = (elem, forceParse = false) => {
        const msgObject = getChatMessageObject(elem);
        if (!msgObject) return;
        Mixera.emit(events.CHAT_MESSAGE, elem, msgObject, forceParse);
    };

    const observe = (watcher, element) => {
        if (!element) return;
        if (watcher) watcher.disconnect();
        watcher.observe(element, {
            childList: true,
            attributes: true,
            subtree: true
        });

        // late load messages events
        element.querySelectorAll("[class^=message__][class*=clickable__]").forEach((el, index) => emitMessage(el));
    };

    const chatModalObserver = (watcher, element) => {
        if (!element) return;
        if (watcher) watcher.disconnect();
        watcher.observe(element, {
            childList: true,
            subtree: true
        });
    };

    const loadMessageHistory = () => {
        if ( !currentChannelId || !currentChatChannelId ) return;
        let scrollWrapper = document.querySelector(CHAT_MESSAGES_SELECTOR)
        let chatMessages = scrollWrapper.querySelectorAll("[class^=message__][class*=clickable__]");
        for ( let i = 0; i < chatMessages.length; i++ ) {
            emitMessage(chatMessages[i], true);
        }
    }

    chatWatcher = new window.MutationObserver(mutations =>
        mutations.forEach(mutation => {
            const target = mutation.target;
            for ( const el of mutation.addedNodes ) {
                // Check if message modal was opened
                if ( el.className && el.className.match(/modal__/) ) {
                    Mixera.emit(events.CHAT_MODAL_OPENED);
                }

                // if ( el.className && el.className.match(/timeStamp__/) ) {
                //     el.remove();
                // }
                
                // Check if there was a new message
                if ( el.className && el.className.match(/message__.+\sclickable__.+/) && !el.classList.contains("eq-deleted-message") ) {
                    emitMessage(el);
                }
            }

            if ( mutation.type === "attributes" ) {
                if ( 
                    mutation.target.className && 
                    mutation.target.className.match(/message__.+\sdeleted__.+/) &&
                    !mutation.target.classList.contains("mixera-show-deleted-message")
                ) {
                    Mixera.emit(events.CHAT_MESSAGE_DELETED, mutation.target);
                }
            }

            // for (const el of mutation.removedNodes) {
            //     console.log(el);
            //     if ( el.className && el.className.match(/message__.+\sclickable__.+/) && !el.classList.contains("eq-deleted-message") ) {
            //         Mixera.emit(events.CHAT_MESSAGE_DELETED, el);
            //     }
            // }
        })
    );

    chatModalWatcher = new window.MutationObserver( mutations => {
        mutations.forEach( mutation => {
            const target = mutation.target;
            for ( const el of mutation.addedNodes) {
                if ( el.className && el.className.match !== undefined && el.className.match(/wrapper__/) ) {
                    document.body.classList.add("mixera-chat-modal-open");
                }
            }

            for (const el of mutation.removedNodes) {
                if ( el.className && el.className.match !== undefined && el.className.match(/wrapper__/) ) {
                    document.body.classList.remove("mixera-chat-modal-open");
                }
            }
        })
    })

    if ( !WatcherLoaded ) {
        Mixera.on(events.LOAD_CHAT, () => {
            observe(chatWatcher, document.querySelector(CHAT_MESSAGES_SELECTOR));
            chatModalObserver(chatModalWatcher, document.querySelector("[class*=chatConcetainer__]"));
        })
        Mixera.on("changed.global_emotes", loadMessageHistory);
        Mixera.on("changed.gif_emotes", loadMessageHistory);
        Mixera.on("changed.chat_highlight_name", loadMessageHistory);
    }
}

const DesktopHeaderObserver = () => {
    const observe = (watcher, element) => {
        if (!element) return;
        if (watcher) watcher.disconnect();
        watcher.observe(element, {
            childList: true,
            subtree: false
        });
    };

    const dekstopHeaderWatcher = new window.MutationObserver(mutations =>
        mutations.forEach(mutation => {
            const target = mutation.target;

            for (const el of mutation.addedNodes) {
                // Check if message modal was opened
                console.log("Added Node In Header: ", el);
                if (el.className && el.className.match(/me-dropdown/)) {
                    waitForLoad("b-desktop-header .me-dropdown").then(elem => {
                        if ( !elem ) return;
                        elem.remove();
                        const mixerHeader = document.querySelector("b-desktop-header");
    
                        if (mixerHeader.classList.contains("searchPinned")) {
                            mixerHeader.classList.remove("searchPinned");
                        }
    
                        // Add back Mixera browse links
                        const links = document.querySelectorAll(".eq-nav-link-browse a");
                        for (let link in links) {
                            link = links[link];
                            if (link.style) {
                                link.style.display = "block";
                            }
                        }
                    })
                }
            }

            // for (const el of mutation.removedNodes) {
            //     if (el.className && el.className.match(/message__.+\sclickable__.+/) && !el.classList.contains("eq-deleted-message")) {
            //         Mixera.emit(events.CHAT_MESSAGE_DELETED, el);
            //     }
            // }
        })
    );

    if ( !WatcherLoaded ) {
        Mixera.once(events.LOAD_GLOBAL, () => observe(dekstopHeaderWatcher, document.querySelector("b-desktop-header nav")))
    }
}

export const Watchers = () => {
    RouteWatcher();
    MixerModalObserver();
    ChatObserver();
    DesktopHeaderObserver();
    window.channel = channel;

    WatcherLoaded = true;

    return null;
}

export default Watchers;