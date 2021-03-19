import { useEffect } from "react";
import { waitForElement } from "Core/helpers/elementLoading";

const HidePrimeButton = () => {
    useEffect( () => {
        let primeButton = null;
        console.log("HIDING PRIME BUTTON");
        waitForElement(".top-nav__prime").then( elem => {
            elem.style.display = "none";
            primeButton = elem;
        })
    
        return () => primeButton ? primeButton.style.display = "inherit" : null;
    }, [])

    return null;
}

HidePrimeButton.settings = [
    {
        id: "hide_prime_button",
        name: "Hide Prime Button",
        category: "general",
        defaultValue: false,
        type: "toggle"
    },
];

export default HidePrimeButton;