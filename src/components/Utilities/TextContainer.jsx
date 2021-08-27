import Container from "react-bootstrap/Container";
const TextContainer = (props)=>{
    return(
        <Container className={props.textCenter==true?"text-center":""}>
            {props.children}
        </Container>
    )
}

export default TextContainer;