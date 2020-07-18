import React from "react";
import { createPortal } from "react-dom";

export class PrependPortal extends React.Component {
    constructor(props) {
        super(props);

        this.root = this.props.root;
        this.el = document.createElement("div");
    }

    componentDidMount = () => {
        this.root.parentElement.insertBefore(this.el, this.root);
    };

    componentWillUnmount = () => {
        this.root.parentElement.removeChild(this.el);
    };

    render() {
        const { children } = this.props;
        return createPortal(children, this.el);
    }
}