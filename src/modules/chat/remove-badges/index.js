import { useEffect } from "react";

const RemoveBadges = () => {
    useEffect(() => {
        document.addEventListener("twixera-new-message", removeBadges);

        return () => {
            document.removeEventListener(
                "twixera-new-message",
                removeBadges
            );
        };
    }, []);

    const removeBadges = ({ detail: { elem } }) => {
        const images = elem.firstElementChild.querySelectorAll("img");

        for ( let i = 0; i < images.length; i++ ) {
            const img = images[i]

            if ( img.alt.match(/(Subscriber|Moderator)/) === null ) {
                const parent = img.closest("a");

                if ( parent ) {
                    parent.style.display = "none";
                } else {
                    img.style.display = "none";
                }
            }
        }
    };

    return null;
};

RemoveBadges.settings = [
    {
        id: "remove_badges",
        name: "Remove Chat Badges",
        description: "Remove all badges from chat messages except moderator and sub badges",
        category: "chat",
        defaultValue: false,
        type: "toggle"
    },
];

export default RemoveBadges;
