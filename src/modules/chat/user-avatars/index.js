import { useEffect } from "react";

const UserAvatars = () => {

    useEffect( () => {
       document.addEventListener("twixera-new-message", addAvatar);

        return () => {
            document.removeEventListener("twixera-new-message", addAvatar);
        };
    }, [])

    const addAvatar = async ({ detail: { elem, user, badges} }) => {
        const hasAvatar = elem.querySelector(".twixera-user-avatar-wrapper");
        if ( hasAvatar ) return;

        const isMod = badges.hasOwnProperty("moderator");
        const isBroadcaster = badges.hasOwnProperty("broadcaster");

        const avatarWrapper = document.createElement("span");
        avatarWrapper.classList.add("twixera-user-avatar-wrapper");
        
        if ( !elem.querySelector(".chat-line__username-container") ) return
        elem.querySelector(".chat-line__username-container").prepend(avatarWrapper);

        var avatar = new Image();
        avatar.style.borderColor = user.color;
        avatar.onload = function () {

            if (isMod) {
                avatarWrapper.classList.add("is-mod");
                avatar.style.borderColor = "#0F0";
            }

            if ( isBroadcaster ) {
                avatarWrapper.classList.add("is-broadcaster");
                avatar.style.borderColor = `#fff`;
            }

            avatarWrapper.appendChild(avatar);
            avatarWrapper.classList.add("animate");
            
        };
        avatar.src = `https://avatar.pixelchat.tv/${user.userLogin}`;

    }

    return null;
}

UserAvatars.settings = [
    {
        id: "user_avatars",
        name: "User Avatars",
        description: "Adds user avatars to the chat messages. Collab with @ACPixel",
        category: "chat",
        defaultValue: true,
        type: "toggle"
    },
];

export default UserAvatars;