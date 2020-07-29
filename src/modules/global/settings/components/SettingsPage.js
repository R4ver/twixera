import React from "react";

import Setting from "./Setting";

const SettingsPage = ({ settings }) => {
    const sortSettings = () => {
        let leftColumn = [];
        let rightColumn = [];

        settings.map((setting, index) => {
            if ( settings.length === 1 ) {
                leftColumn.push(setting);
                return;
            }

            if ( index % 2) {
                rightColumn.push(setting);
            } else {
                leftColumn.push(setting);
            }
        });

        return { leftColumn, rightColumn };
    };

 
    return(
        <div className="twixera-page settings">
            <div className="left-column">
                {sortSettings().leftColumn.map((setting) => (
                    !setting.disabled && setting.editable ? <Setting key={setting.id} {...setting} /> : null
                ))}
            </div>

            <div className="right-column">
                {sortSettings().rightColumn.map((setting) => (
                    !setting.disabled && setting.editable ? <Setting key={setting.id} {...setting} /> : null
                ))}
            </div>
        </div>
    )
};

export default SettingsPage;