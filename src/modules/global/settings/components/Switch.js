import React from "react";

const Switch = ({ value, onChange, className }) => (
    <label className={`twixera-switch ${className ? className : ""}`}>
        <input type="checkbox" checked={value} onChange={onChange} />
        <span className="slider round"></span>
    </label>
);
export default Switch;
