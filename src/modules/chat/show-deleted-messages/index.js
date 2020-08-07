import { useEffect } from "react";

const ShowDeletedMessages = () => {
    useEffect(() => {
        document.addEventListener("twixera-deleted-message", showDeletedMessage);

        return () => {
            document.removeEventListener("twixera-deleted-message", showDeletedMessage);
        };
    }, []);

    const showDeletedMessage = ({ detail: { elem, user, messageBody } }) => {
        console.log("Deleted message: ", elem, messageBody);
        elem.innerText = `(deleted) ${messageBody}`;
        elem.closest(".chat-line__message").classList.add("twixera-deleted-message");
    };

    return null;
}

ShowDeletedMessages.settings = [
    {
        id: "show_deleted_messages",
        name: "Show Deleted Messages",
        description: "Turns <message deleted> back to the original message.",
        category: "chat",
        defaultValue: false,
        type: "toggle",
    },
];

export default ShowDeletedMessages;