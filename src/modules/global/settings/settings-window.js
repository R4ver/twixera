import React, { useState } from "react"
import Log from "Core/utils/log";
import { useStore } from "Store";
import { SET_SETTINGS_PATH } from "Store/actions/settings";

import Dashboard from "./pages/dashboard";
import SettingsPage from "./components/SettingsPage";
import NavLink from "./components/NavLink";

const SettingsWindow = ({closeSettings, news}) => {
    const [state] = useStore();
    const [currentPage, setCurrentPage] = useState("dashboard");

    const changePage = page => {
        setCurrentPage(page);
    }

    const renderPage = pageName => {
        const settings = Object.values(state.settings).filter( value => value.category === pageName );

        switch (currentPage) {
            case "dashboard":
                return <Dashboard news={news} />;

            default:
                return <SettingsPage settings={settings} />;
        }
    }

    const renderNav = () => {
        const filteredCategories = Object.values(state.settings).map( value => {
            if ( value.category && !value.disabled ) {
                return value.category
            }
        } ).filter( e => e !== undefined);
        const categories = ["dashboard", ...new Set(filteredCategories)]
        
        return categories.map((category) => (
            <NavLink key={category} to={category} currentPage={currentPage} activeClassname="is-active" style={{textTransform: "capitalize"}} onClick={() => changePage(category)}>
                {category}
            </NavLink>
        ));
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
                                <img
                                    src={
                                        process.env.NODE_ENV === "development"
                                            ? "https://r4ver.com/twixera/assets/twixera-logo-dev.svg"
                                            : "https://r4ver.com/twixera/assets/twixera-logo.svg"
                                    }
                                />
                            </div>

                            {renderNav()}
                        </nav>
                    </div>

                    <div className="header-right">
                        {state.user.displayName && (
                            <div className="twixera-user">
                                <span>{state.user.displayName}</span>
                                <div className="twixera-avatar-wrapper">
                                    <img
                                        src={state.user.avatar}
                                        alt={state.user.displayName}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={closeSettings}
                            className="twixera-settings-close"
                        >
                            X
                        </button>
                    </div>
                </header>

                <div className="twixera-settings-body">
                    {renderPage(currentPage)}
                </div>
            </div>
        </>
    );
}

export default SettingsWindow;