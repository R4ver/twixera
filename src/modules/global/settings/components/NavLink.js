import React from "react";
import { useStore } from "Store";
import { SET_SETTINGS_PATH } from "Store/actions/settings";

const NavLink = ({to, activeClassname, children}) => {
    const [{settings: {pathname}}, dispatch] = useStore();

    return (
        <button
            className={`settings-nav-item ${pathname === to ? activeClassname : ""}`}
            onClick={() => dispatch(SET_SETTINGS_PATH(to))}
        >
            {children}
        </button>
    );
}

export default NavLink;