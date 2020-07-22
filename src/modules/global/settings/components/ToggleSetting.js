import React from "react";
import { UPDATE_SETTING } from "Store/actions/settings";

import Switch from "./Switch";

const ToggleSetting = ({ id, value, name, disabled, soon, description, dispatch}) => (
    <div className={`twixera-card setting-id-${id} ${value ? "is-active" : "is-inactive"}`}>
        <div className="twixera-setting type-toggle">
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
                        value={value}
                        onChange={() => dispatch(UPDATE_SETTING(id, !value))}
                    />
                </header>
                
                { description && <h2 className="twixera-subtitle">{description}</h2> }
            </div>
        </div>
    </div>
)

export default ToggleSetting;