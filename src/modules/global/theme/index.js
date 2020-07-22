import React, { useEffect } from "react";
import { useStore } from "Store";
import { getSetting } from "Core/settings";

const twitchDarkClass = "tw-root--theme-dark";

const Theme = () => {
    const [state] = useStore();

    useEffect( () => {
        switch (state.settings.twitch_theme.value) {
            case "twixera":
                document.getElementsByTagName("html")[0].classList.remove(twitchDarkClass);
                document.getElementsByTagName("html")[0].classList.add(`twixera--theme-twixera`);
                document.getElementsByTagName("html")[0].classList.add(twitchDarkClass);
                window.localStorage.setItem("twilight.theme", 1);
                break;

            case "dark":
                document.getElementsByTagName("html")[0].classList.remove(`twixera--theme-twixera`);
                document.getElementsByTagName("html")[0].classList.add(twitchDarkClass);
                window.localStorage.setItem("twilight.theme", 1);
                break;

            case "white":
                document.getElementsByTagName("html")[0].classList.remove(`twixera--theme-twixera`);
                document.getElementsByTagName("html")[0].classList.remove(twitchDarkClass);
                window.localStorage.setItem("twilight.theme", 0);
                break;

            default:
                break;
        }
    }, [state.settings.twitch_theme.value])

    return null;
}

Theme.settings = [
    {
        id: "twitch_theme",
        name: "Twitch Theme",
        description: "Change your theme on Twitch!",
        category: "general",
        defaultValue: "twixera",
        values: ["twixera", "dark", "white"],
        editable: true,
        type: "select",
    },
];

export default Theme;