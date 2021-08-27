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

const Login = () => {
    const user = useSelector((state)=>state.auth.userDetails);
    const alert = useAlert();
    const dispatch = useDispatch();
    const history = useHistory();
    const [userDetails, setUserDetails] = useState({username:"",password:""});
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/user/login", userDetails).then((res) => {
            dispatch(login(res.data));
            history.push("/");
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error("bahut bada message hai ye to sama hi nhi sakta ek line me line ki to phategi hi");
            }
        })
    }
    const handleChange = (e) => {
        setUserDetails((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        })
    }

    return (
        <div style={{ "paddingTop": "10vh" }}>

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
                            <Input name="password" placeholder="Password.." fullWidth required value={userDetails.password} type="password" onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" color="primary"><h3>Submit</h3></Button>
                        </Col>
                    </Row>
                </form>

            </Container>
        </div>
    )
}
export default Login;