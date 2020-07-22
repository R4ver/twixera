import React from "react";
import { useStore } from "Store";
import { SET_SETTINGS_PATH } from "Store/actions/settings";

const NavLink = ({ to, currentPage, activeClassname, children, ...rest }) => (
    <button
        className={`settings-nav-item ${
            currentPage === to ? activeClassname : ""
        }`}
        onClick={() => dispatch(SET_SETTINGS_PATH(to))}
        {...rest}
    >
        {children}
    </button>
);

export default NavLink;