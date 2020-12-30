import React from "react";

export const Button = props => {
    return (
        <button
            className={`twixera-twitch-button tw-align-items-center tw-align-middle tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-core-button tw-core-button--secondary tw-inline-flex tw-interactive tw-justify-content-center tw-overflow-hidden tw-relative tw-mg-l-1`}
            {...props}
        >
            {props.children}
        </button>
    );
}