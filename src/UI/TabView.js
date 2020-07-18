import React from "react";
import { addSetting, getSetting, setSetting } from "Core/settings";

addSetting({
    id: "settings_sidebar_minimized",
    name: "Sidebar Minimized",
    category: "global",
    defaultValue: false,
    editable: false
});

export class TabView extends React.Component {
    state = {
        selected: 0,
        minimized: false
    }

    componentDidMount() {
        this.setState({
            selected: this.props.selected,
            minimized: getSetting("settings_sidebar_minimized")
        })
    }

    handleClick = (index) => {
        this.setState({ selected: index });
    }

    minimizeSidebar = () => {
        let newState = !this.state.minimized;
        
        // Hide the logo text in the top bar
        let settingsLogoText = document.querySelector(".mixera-logo-wrapper span");
        settingsLogoText.classList.toggle("is-minimized");

        this.setState({
            minimized: newState
        });

        setSetting("settings_sidebar_minimized", newState);
    }

    _renderTitles = () => {
        function labels(child, index, _this) {
            let activeClass = (_this.state.selected === index ? "is-active" : "");

            if ( child.props.collapseButton ) {
                return (
                    <a key={index} className={`eq-tab collapse-button ${child.props.className}`} onClick={_this.minimizeSidebar}>
                        {child.props.label}
                    </a>
                )
            }

            return (
                <a key={index} className={"eq-tab " + child.props.className + " " + activeClass} onClick={() => {
                    _this.handleClick(index);
                    if ( child.props.onClick ) {
                        child.props.onClick(index);
                    }
                }}>
                    {child.props.label}

                    {child.props.toolTip && <span className="tab-tooltip">{child.props.toolTip}</span>}
                </a>
            )
        }

        let footerContent = [];

        return (
            <div className={`eq-tabs ${this.state.minimized ? "is-minimized" : ""}`}>
                {this.props.sidebar ? (
                    <>
                        <div className="eq-tabs-content">
                            {this.props.sidebarTitle &&
                                <header className="eq-header eq-tabview-sidebar">
                                    <h1 className="eq-title is-3">{this.props.sidebarTitle}</h1>
                                </header>
                            }
                            {this.props.children.map( (child, index) => {
                                if ( child.props.ignore ) {
                                    return child;
                                }

                                if ( child.props.isFooterItem ) {
                                    footerContent.push(labels(child, index, this));
                                    return;
                                } else {
                                    return labels(child, index, this);
                                }

                            })}
                        </div>
                        <SideBarFooter className="eq-tabs-content">
                                {footerContent}
                        </SideBarFooter>
                    </>
                ) : (
                    <>
                        {this.props.children.map((child, index) => labels(child, index, this))}
                    </>
                )
                }

                {/* {this.props.sidebar && this.props.children.map(elem => {
                    if ( elem.props.isFooter ) {
                        return (elem);
                    }
                })} */}
            </div>
        );
    }

    _renderContent = () => {
        return (
            <div className="eq-tabview-content">
                {this.props.children[this.state.selected]}
            </div>
        )
    }

    render() {
        return (
            <div className={"eq-tabview " + this.props.name}>
                {this._renderTitles()}
                {this._renderContent()}
            </div>
        );
    }
}

export class Tab extends React.Component {

    render() {
        return (
            <>
                {this.props.children}
            </>
        )
    }
}

export const SideBarFooter = props => (
    <footer className={`mixera-settings-sidebar-footer` + props.className}>
        {props.children}
    </footer>
)