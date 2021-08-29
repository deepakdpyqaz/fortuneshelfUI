import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SectionTitle from "../../components/SectionTitle";
import Input from "@material-ui/core/Input";
import axios from "axios";
import { Button } from "../../components/Utilities";
import Alert from "react-bootstrap/Alert";
import { useSelector,useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../reducers/auth";
import { useAlert } from "react-alert";
import { reactLocalStorage } from "reactjs-localstorage";

const Login = () => {
    const user = useSelector((state)=>state.auth.userDetails);
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();
    const [userDetails, setUserDetails] = useState({username:"",password:""});
    const [disabled,setDisabled] = useState(true);
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/user/login", userDetails).then((res) => {
            dispatch(login(res.data));
            reactLocalStorage.set("token",res.data.token);
            axios.defaults.headers.authorization = res.data.token;
            history.push("/");
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        })
    }
    const validate = (data) =>{
        if(data.username && data.password && data.password.length>4){
            setDisabled(false);
        }
        else{
            setDisabled(true);
        }
    }
    const handleChange = (e) => {
        setUserDetails((prevData) => {
            let newData = {...prevData,[e.target.name]:e.target.value};
            validate(newData);
            return newData;
        })
    }

    return (
        <div className="view_page">

            <Container style={{"maxWidth":"600px"}} className="my-3 py-3" fluid="sm">
                <SectionTitle title="Login to your account" />
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Input name="username" placeholder="Mobile or Email" fullWidth required value={userDetails.username} onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input name="password" placeholder="Password.." fullWidth required value={userDetails.password}  type="password" onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" disabled={disabled} color="primary"><h3>Login</h3></Button>
                        </Col>
                    </Row>
                </form>

            </Container>
        </div>
    )
}
export default Login;