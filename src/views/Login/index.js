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
    const history = useHistory();
    const user = useSelector((state)=>state.auth.userDetails);
    if(user && user.id){
        history.push("/")
    }
    const alert = useAlert();
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({username:"",password:""});
    const [validation,setValidation] = useState({"username":false,"password":false})
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
        if(data){
            const usernameRe = /(^[0-9]{10}$)|(^(\w|.)+@[a-zA-Z_.]+?\.[a-zA-Z.]{2,3}$)/;
            setValidation({"username":!(usernameRe.test(data.username)),"password":data.password.length<=4});
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
                            <Input error={validation.username} name="username" placeholder="Mobile or Email" fullWidth required value={userDetails.username} onChange={handleChange} />
                            {validation.username?<span className="text-danger">Enter a valid 10 digit moibile number or a valid Email</span>:null}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input error={validation.password} name="password" placeholder="Password.." fullWidth required value={userDetails.password}  type="password" onChange={handleChange} />
                            {validation.password?<span className="text-danger">Password must be atleast 4 letters</span>:null}
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" disabled={Boolean(validation.username || validation.password) && validation.username && validation.password} color="primary"><h3>Login</h3></Button>
                        </Col>
                    </Row>
                </form>

            </Container>
        </div>
    )
}
export default Login;