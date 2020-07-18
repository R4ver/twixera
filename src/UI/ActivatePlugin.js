import React from 'react';
import {withAppContext} from "Core/withAppContext";

class ActivatePlugin extends React.Component {
    onChange = () => {
        let newArr = this.props.settings.activeplugins;
        if ( newArr.indexOf(this.props.plugin) > -1) {
            newArr.splice(newArr.indexOf(this.props.plugin), 1);
        } else {
            newArr.push(this.props.plugin);
        }

        this.props.context.saveSetting({
            name: "activeplugins",
            value: newArr
        });

        window.dispatchEvent(new CustomEvent('EQ_SETTINGS_UPDATED'));
    }

    render() {
        return (
            <label className="eq-label full-width eq-activate-plugin">
                <label className="switch">
                    <input type="checkbox" checked={this.props.context.pluginIsActive(this.props.plugin) ? "checked" : ""} onChange={this.onChange}/>
                    <span className="slider round"></span>
                </label>
            </label>
        )
    }
}

export default withAppContext(ActivatePlugin);