export const REACT_ROOT = "#root div";
export const CHANNEL_CONTAINER = ".channel-page,.channel-root";
export const CHAT_CONTAINER = `section[data-test-selector="chat-room-component-layout"]`;
export const VOD_CHAT_CONTAINER = ".qa-vod-chat";
export const CHAT_LIST = ".chat-list";
export const PLAYER = ".video-player__container";
export const CLIPS_BROADCASTER_INFO = ".clips-broadcaster-info";
export const CHAT_MESSAGE_SELECTOR = ".chat-line__message";

function getReactInstance(element) {
    for (const key in element) {
        if (key.startsWith("__reactInternalInstance$")) {
            return element[key];
        }
    }

    return null;
}

function searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
    try {
        if (predicate(node)) {
            return node;
        }
    } catch (_) {}

    if (!node || depth > maxDepth) {
        return null;
    }

    const { return: parent } = node;
    if (parent) {
        return searchReactParents(parent, predicate, maxDepth, depth + 1);
    }

    return null;
}

function searchReactChildren(node, predicate, maxDepth = 15, depth = 0) {
    try {
        if (predicate(node)) {
            return node;
        }
    } catch (_) {}

    if (!node || depth > maxDepth) {
        return null;
    }

    const { child, sibling } = node;
    if (child || sibling) {
        return (
            searchReactChildren(child, predicate, maxDepth, depth + 1) ||
            searchReactChildren(sibling, predicate, maxDepth, depth + 1)
        );
    }

    return null;
}

//============================================================

export const getRouter = () => {
    let router;

    try {
        const node = searchReactParents(
            getReactInstance(document.querySelector(REACT_ROOT)),
            n => n.stateNode && n.stateNode.props && n.stateNode.props.history && n.stateNode.props.history.listen && n.stateNode.props.history.location
        );
        router = node.stateNode.props;
    } catch (_) {}

    if (!router) {
        try {
            const node = searchReactParents(
                getReactInstance(document.querySelector(REACT_ROOT)),
                n => n.memoizedProps && n.memoizedProps && n.memoizedProps.value && n.memoizedProps.value.history && n.memoizedProps.value.history.listen && n.memoizedProps.value.history.location,
                20
            );
            router = node.memoizedProps.value;
        } catch (_) {}
    }

    return router;
}

export const getConnectStore = () => {
    let store;
    try {
        const node = searchReactParents(
            getReactInstance(document.querySelector(REACT_ROOT)),
            n => n.pendingProps && n.pendingProps.value && n.pendingProps.value.store
        );
        store = node.pendingProps.value.store;
    } catch (_) {}

    return store;
}

export const getChatServiceClient = () => {
    if (chatClient) return chatClient;

    try {
        const node = searchReactChildren(
            getReactInstance($(REACT_ROOT)[0]),
            n => n.stateNode && n.stateNode.join && n.stateNode.client,
            1000
        );
        chatClient = node.stateNode.client;
    } catch (_) {}

    return chatClient;
}

export const getChatServiceSocket = () => {
    let socket;
    try {
        socket = getChatServiceClient().connection.ws;
    } catch (_) {}
    return socket;
}

export const getChatMessageObject = (element) => {
    let msgObject;
    try {
        msgObject = getReactInstance(element).return.stateNode.props.message;
    } catch (_) {}

    return msgObject;
}

/**
 * Get the current Twitch channel
 */
export const getCurrentChannel = () => {
    let rv;

    const clipsBroadcasterInfo = getClipsBroadcasterInfo();
    if (clipsBroadcasterInfo) {
        rv = {
            id: clipsBroadcasterInfo.id,
            name: clipsBroadcasterInfo.login,
            displayName: clipsBroadcasterInfo.displayName,
            avatar: clipsBroadcasterInfo.profileImageURL
        };
    }

    const currentChat = getCurrentChat();
    if (currentChat && currentChat.props && currentChat.props.channelID) {
        const {channelID, channelLogin, channelDisplayName, data} = currentChat.props;

        rv = {
            id: channelID.toString(),
            name: channelLogin,
            displayName: channelDisplayName,
            color: data.user.primaryColorHex,
        };
    }

    const currentVodChat = getCurrentVodChat();
    if (currentVodChat && currentVodChat.props && currentVodChat.props.data && currentVodChat.props.data.video) {
        const {owner: {id, login}} = currentVodChat.props.data.video;
        rv = {
            id: id.toString(),
            name: login,
            displayName: login
        };
    }

    return rv;
}

export const getClipsBroadcasterInfo = () => {
    let router;
    try {
        const node = searchReactParents(
            getReactInstance(document.querySelector(CLIPS_BROADCASTER_INFO)),
            n => n.stateNode && n.stateNode.props && n.stateNode.props.data && n.stateNode.props.data.clip
        );
        router = node.stateNode.props.data.clip.broadcaster;
    } catch (_) {}

    return router;
}

export const getCurrentChat = () => {
    let currentChat;
    try {
        const node = searchReactParents(
            getReactInstance(document.querySelector(".chat-room")),
            (n) => n.stateNode && n.stateNode.props && n.stateNode.props.channelID && n.stateNode.props.data.user
        );
        currentChat = node.stateNode;
    } catch (_) {}

    return currentChat;
}

export const getCurrentVodChat = () => {
    let currentVodChat;
    try {
        const node = searchReactParents(
            getReactInstance(document.querySelector(VOD_CHAT_CONTAINER)),
            n => n.stateNode && n.stateNode.props && n.stateNode.props.data && n.stateNode.props.data.video
        );
        currentVodChat = node.stateNode;
    } catch (_) {}

    return currentVodChat;
}