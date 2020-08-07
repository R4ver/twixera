import { useEffect } from "react";

const FounderBadge = () => {

    useEffect( () => {
       document.addEventListener("twixera-new-message", addFounderBadge);

        return () => {
            document.removeEventListener("twixera-new-message", addFounderBadge);
        };
    }, [])

    const addFounderBadge = async ({ detail: { elem, user, badges} }) => {
        const hasFounderBadge = elem.querySelector(".twixera-user-founder-badge");
        const hasElement = elem.querySelector(".chat-line__username-container") !== null;
        if ( hasFounderBadge || user.userID !== "28075085" || !hasElement ) return;

        const founderBadge = document.createElement("span");
        founderBadge.classList.add("twixera-user-founder-badge");

        const linkWrapper = document.createElement("a");
        linkWrapper.href = `https://twitch.tv/${user.userLogin}`;
        linkWrapper.target = "__blank";
        linkWrapper.rel = "noopener noreferrer";

        const twixeraIcon = document.createElement("img");
        twixeraIcon.src = "https://r4ver.com/twixera/assets/twixera-logo.svg";

        const tooltip = document.createElement("div");
        tooltip.classList.add("tw-tooltip", "tw-tooltip--align-center", "tw-tooltip--up");
        tooltip.setAttribute("data-a-target", "tw-tooltip-label");
        tooltip.style.marginBottom = "0.9rem";
        tooltip.innerText = "Twixera Founder";

        linkWrapper.appendChild(twixeraIcon);
        linkWrapper.appendChild(tooltip);
        founderBadge.appendChild(linkWrapper);
        elem.querySelector(".chat-line__username-container").prepend(founderBadge);
    }

    return null;
}

FounderBadge.settings = [
    {
        id: "founder_badge",
        name: "Founder Badge",
        description: "Adds founder badge to R4ver",
        category: "chat",
        defaultValue: true,
        editable: false
    },
];

export default FounderBadge;