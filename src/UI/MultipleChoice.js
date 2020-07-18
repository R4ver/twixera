const MultipleChoice = props => {
    const { value, values, onClick } = props;

    props.className = `eq-multiple-choice ${props.className}`;

    let choices = values.map( (choice, index) => {
        let isSoon = false;
        if (choice.match(/.+__soon/)) {
            isSoon = true;
            choice = choice.replace(/__soon/g, "");
            console.log(choice);
        }

        return (
            <button 
                className={
                    `eq-button eq-multiple-choice-button 
                    ${value === choice ? "is-active" : ""}
                    ${isSoon ? "is-soon" : ""}`
                }
                onClick={ isSoon ? null : () => onClick(index)}
            >
                {choice}
            </button>
        )
    })

    return (
        <div className={props.className} >
            {choices}
        </div>
    )
}

export default MultipleChoice;