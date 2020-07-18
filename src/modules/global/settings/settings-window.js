import React, { useEffect } from "react"
import Log from "Core/utils/log";
import { useStore } from "Store";
import { SET_SETTINGS_PATH } from "Store/actions/settings";

import Dashboard from "./pages/dashboard";
import SettingsPage from "./components/SettingsPage";
import NavLink from "./components/NavLink";

const SettingsWindow = ({closeSettings, news}) => {
    const [state, dispatch] = useStore();

    const renderPage = pageName => {
        const settings = Object.values(state.settings).filter( value => value.category === state.settings.pathname );

        switch (pageName) {
            case "dashboard":
                return <Dashboard news={news}/>

            case "chat":
                return <SettingsPage settings={settings} />

            default:
                return <Dashboard />;
        }
    }

    return (
        <>
            <div
                className="twixera-settings-overlay"
                onClick={closeSettings}
            ></div>
            <div className="twixera-settings">
                <header className="twixera-settings-header">
                    <div className="header-left">
                        <nav className="settings-nav">
                            <div className="twixera-logo-wrapper">
                                <img src="https://r4ver.com/twixera/assets/twixera-logo.svg" />
                            </div>

                            <NavLink to="dashboard" activeClassname="is-active">
                                Dashboard
                            </NavLink>
                            <NavLink to="chat" activeClassname="is-active">
                                Chat
                            </NavLink>
                        </nav>
                    </div>

                    <div className="header-right">
                        {state.user.displayName &&
                            <div className="twixera-user">
                                <span>{state.user.displayName}</span>
                                <div className="twixera-avatar-wrapper">
                                    <img
                                        src={state.user.avatar}
                                        alt={state.user.displayName}
                                    />
                                </div>
                            </div>
                        }

                        <button
                            onClick={closeSettings}
                            className="twixera-settings-close"
                        >
                            X
                        </button>
                    </div>
                </header>

                <div className="twixera-settings-body">
                    {renderPage(state.settings.pathname)}
                </div>
            </div>
        </>
    );
}

export default SettingsWindow;