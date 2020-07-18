import React from "react";
import { useStore } from "Store";
import { TOGGLE_SETTING } from "Store/actions/settings";

import Switch from "./Switch";

const Setting = ({id, active, value, description, name, soon, childSettings, values = null, disabled}) => {
    const [, dispatch] = useStore();

    return (
        <div className={`twixera-card setting-id-${id} ${active ? "is-active" : "is-inactive"}`}>
            <div className="twixera-setting">
                <div className="twixera-setting-info">
                    <header>
                        <h1 className="twixera-title">
                            {name}

                            {disabled ? 
                                <span className="twixera-tooltip is-info is-small"> ― Globally Disabled</span> 
                                : 
                                ""
                            } 
                            {(soon ? "- (Soon™)": "")}</h1>
                        <Switch 
                            className="twixera-settings-switch" 
                            value={active}
                            onChange={() => dispatch(TOGGLE_SETTING(id, !active))}
                        />
                    </header>
                    
                    { description && <h2 className="twixera-subtitle">{description}</h2> }
                </div>
            </div>
        </div>
    )
}

export default Setting;