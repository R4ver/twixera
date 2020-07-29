import React, { useState, useEffect } from 'react';
import { render } from "react-dom";
// import { FixLiveNowModal, fixNav } from "Core/utils/mixera";
// import { waitForElement } from "Core/helpers/waitFor";
// import NotificationWrapper from "UI/NotificationWrapper";
import { StateProvider } from "Core/store";

// Import EQ Stylesheet
import "animate.css/animate.css";
import "react-toastify/dist/ReactToastify.css";
import "./scss/twixera.scss";
import App from "./app";

const Twixera = () => {
    return (
        <StateProvider>
            <App />
        </StateProvider>
    )
}

const extensionDiv = document.createElement('div');
extensionDiv.id = "twixera-root";
document.body.appendChild(extensionDiv);
render(<Twixera />, extensionDiv);
