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
const Login = () => {
    const user = useSelector((state)=>state.auth.userDetails);
    const dispatch = useDispatch();
    const history = useHistory();
    // if(user && user.userId){
    //     history.push("/");
    // }
    const [userDetails, setUserDetails] = useState({});
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [alertType,setAlertType]=useState("danger");
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/user/login", userDetails).then((res) => {
            dispatch(login(res.data));
            history.push("/");
        }).catch((err) => {
            setShow(true);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
            else {
                setError(err.message);
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
            <Alert variant={alertType} show={show} onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{error}</Alert.Heading>
            </Alert>

            <Container className="w-50">
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