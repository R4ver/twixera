import React from "react";
import { UPDATE_SETTING } from "Store/actions/settings";

import Switch from "./Switch";

const ToggleSetting = ({ active, id, value, name, disabled, soon, description, dispatch, childSettings }) => (
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

                {active && childSettings && childSettings.map(setting => (
                    <div key={`${id}_${setting.id}`} className="twixera-child-settings">
                        <input type="range" id="vol" name="vol" min="0" max="1" onChange={e => dispatch(UPDATE_SETTING(`${setting.id}`, e.target.value))}/>
                    </div>
                ))
                    
                }
            </div>
        </div>
    </div>
)

export default ToggleSetting;