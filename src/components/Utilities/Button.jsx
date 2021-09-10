import "./utilities.scss";
const Button = (props)=>{
    let classList = "fs_button"+" " + props.variant+" "+props.color;
    if (props.disabled){
        classList+=" disabled"
    }
    return (
        <>
            <button onClick={props.onClick} type={props.type?props.type:"submit"} disabled={props.disabled==true?true:false} className={classList}>{props.children}</button>
        </>
    )
}

export default Button;