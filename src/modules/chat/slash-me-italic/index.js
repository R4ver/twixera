import { useEffect } from "react";

const SlashMeItalic = () => {

    useEffect( () => {
       document.addEventListener("twixera-new-message", italicMe);

        return () => {
            document.removeEventListener("twixera-new-message", italicMe);
        };
    }, [])

    const italicMe = ({ detail: { elem, rawMessage } }) => {
        if (rawMessage.messageType === 1) {
            elem.style.color = "rgba(255,255,255,.8)";
            elem.style.fontStyle = "italic";
        }
    };

    return null;
}

SlashMeItalic.settings = [
    {
        id: "slash_me_italic",
        name: "New /me styling",
        description: "Make the /me command use white font color and italic styling",
        category: "chat",
        defaultValue: true,
        type: "toggle"
    },
];

export default SlashMeItalic;