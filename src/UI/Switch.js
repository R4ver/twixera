const Switch = props => {
    const { value, onChange } = props;

    props.className = `mixera-switch ${props.className}`;

    return (
        <label className={props.className}>
            <input type="checkbox" checked={value} onChange={onChange}/>
            <span className="slider round"></span>
        </label>
    )
}


export default Switch;