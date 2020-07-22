import React from "react";
import { useStore } from "Store";

import ToggleSetting from "./ToggleSetting";
import SelectSetting from "./SelectSetting";

const Setting = props => {
    const [, dispatch] = useStore();

    const renderSettingFromType = () => {
        switch (props.type) {
            case "toggle":
                return <ToggleSetting {...props} dispatch={dispatch} />

            case "select":
                return <SelectSetting {...props} dispatch={dispatch} />
                
            default:
                return null
        }
    }

    return renderSettingFromType();
}

export default Setting;