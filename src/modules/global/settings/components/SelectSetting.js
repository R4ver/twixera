import React from "react";
import { UPDATE_SETTING } from "Store/actions/settings";

const SelectSetting = ({ id, value, values = [], name, disabled, soon, description, dispatch}) => (
    <div className={`twixera-card setting-id-${id}`}>
        <div className="twixera-setting type-select">
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
                </header>
                
                { description && <h2 className="twixera-subtitle">{description}</h2> }

                <div className="setting-values">
                    {values.map( (val, i) => (
                        <button key={`val-${i}`} className={`select-button ${value === val ? "is-active" : ""}`} onClick={() => dispatch(UPDATE_SETTING(id, val))}>
                            {val}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export default SelectSetting;