import "./utilities.scss";
const Button = (props)=>{
    const classList = "fs_button"+" " + props.variant+" "+props.color;
    return (
        <>
            <button onClick={props.onClick} className={classList}>{props.children}</button>
        </>
    )
}

export default Button;