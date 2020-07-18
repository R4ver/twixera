import React from "react";

const TextBox = ({onChange, ...props}) => (
    <div className={`mixera-input ${props.className ? props.className : ""}`}>
        <input type="text" onChange={ e => onChange(e.target.value)} placeholder={props.placeholder}/>
    </div>
)

export default TextBox;