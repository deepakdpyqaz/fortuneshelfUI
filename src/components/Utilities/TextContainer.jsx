import Container from "react-bootstrap/Container";
const TextContainer = (props)=>{
    return(
        <Container>
            {props.children}
        </Container>
    )
}

export default TextContainer;