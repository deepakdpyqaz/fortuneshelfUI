import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import { Button } from "../../components/Utilities";
import SectionTitle from "../../components/SectionTitle";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useAlert } from "react-alert";
import Modal from "react-bootstrap/Modal";
import {useHistory} from "react-router-dom";
const Signup = () => {
    const [userDetails, setUserDetails] = useState({});
    const alert = useAlert();
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userVerificationDetails,setUserVerificationDetails] = useState({});
    const handleClose = () => setShow(false);
    const history = useHistory();
    const handleUserVerificationChange = (e) =>{
        setUserVerificationDetails((prevData)=>{
            return {
                ...prevData,
                [e.target.name]:e.target.value
            }
        })
    }
    const handleUserVerificationSubmit = (e)=>{
        e.preventDefault();
        axios.post("/user/reset_password",userVerificationDetails).then((res)=>{
            setShowModal(false);
            alert.success("Account Created Succesfully")
            history.push("/login");

        }).catch((err)=>{
            setShow(true);
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message)
            }
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/user/signup", userDetails).then((res) => {
            setUserVerificationDetails((prevData)=>{
                return{...prevData,userId:res.data.userId,isVerfied:false}
            })
            setShowModal(true);
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        })
    }
    const handleChange = (e) => {
        setUserDetails((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        })
    }
    return (
        <div className="view_page">

            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Generate Password</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleUserVerificationSubmit}>
                <Modal.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <Input type="password" error={userVerificationDetails.password!=userVerificationDetails.confirm_password} minlength="5" fullWidth placeholder="Password" name="password" onChange={handleUserVerificationChange} value={userVerificationDetails.password} required />
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                    <Input type="password" error={userVerificationDetails.password!=userVerificationDetails.confirm_password} fullWidth placeholder="Confirm Password" name="confirm_password" onChange={handleUserVerificationChange} value={userVerificationDetails.confirm} required />
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                    <Input type="text" fullWidth placeholder="Enter Otp received on mobile/Email" name="otp" onChange={handleUserVerificationChange} value={userVerificationDetails.otp} required />
                                </Col>
                            </Row>
                        </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="filled" disabled={!(userVerificationDetails.password && userVerificationDetails.password.length>4 && userVerificationDetails.password==userVerificationDetails.confirm_password && userVerificationDetails.otp)} color="primary" type="submit" onClick={handleClose}>
                        Verify
                    </Button>
                </Modal.Footer>
            </form>
            </Modal>


            <Container className="w-75">
                <SectionTitle title="Create New Account" />
                <form onSubmit={handleSubmit}>
                    <Row className="my-2">
                        <Col md="6" className="my-2">
                            <Input name="first_name" placeholder="First Name.." fullWidth required value={userDetails.first_name} onChange={handleChange} />
                        </Col>
                        <Col md="6" className="my-2">
                            <Input name="last_name" placeholder="Last Name.." fullWidth required value={userDetails.last_name} onChange={handleChange} />
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col md="6" className="my-2">
                            <Input placeholder="Mobile.." name="mobile" fullWidth required value={userDetails.mobile} onChange={handleChange} />
                        </Col>
                        <Col md="6" className="my-2">
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={userDetails.email} onChange={handleChange} />
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col className="my-2">
                            <Input name="age" placeholder="Age.." fullWidth required value={userDetails.age} type="number" onChange={handleChange} />
                        </Col>
                        <Col className="my-2">
                            <Form.Select required placeholder="Gender" name="gender" onChange={handleChange} value={userDetails.gender} aria-label="Gender" style={{ "border": "none", "borderBottom": "1px solid black", "borderRadius": "0px" }}>
                                <option>Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" color="primary"><h3>Submit</h3></Button>
                        </Col>
                    </Row>
                </form>
                <br />
                <br />
                <br />

            </Container>

        </div>
    )
}

export default Signup;