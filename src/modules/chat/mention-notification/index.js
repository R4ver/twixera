import { useEffect } from "react";

const MentionNotifaction = () => {
    useEffect(() => {
        document.addEventListener("twixera-new-message", checkMessageForMention);

        return () => {
            document.removeEventListener("twixera-new-message", checkMessageForMention);
        };
    }, [])

    const checkMessageForMention = ({detail: { elem, rawMessage}}) => {
        console.log("Checking Message");
        console.log(rawMessage)
    }

    const notifyUser = () => {
        
    }

    return null;
}

MentionNotifaction.settings = [
    {
        disabled: true,
        id: "mention_notification",
        name: "Mention Notification",
        description: "Get a notification sound when someone mentions you in chat",
        category: "chat",
        defaultValue: false,
        type: "toggle",
        childSettings: [
            {
                type: "volume",
                id: "volume",
                defaultValue: 30,
                editable: true
            },
            {
                type: "audio",

            }
        ]
    },
]

export default MentionNotifaction;