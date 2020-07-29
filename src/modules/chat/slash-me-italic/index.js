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
        category: "chat",
        defaultValue: true,
        editable: false,
    },
];

export default SlashMeItalic;