import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import { Button } from "../../components/Utilities";
import SectionTitle from "../../components/SectionTitle";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import {useHistory} from "react-router-dom";
const Signup = () => {
    const [userDetails, setUserDetails] = useState({});
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [userVerificationDetails,setUserVerificationDetails] = useState({});
    const handleClose = () => setShow(false);
    const handleCloseModal = () => setShowModal(false);
    const handleShow = () => setShow(true);
    const [alertType,setAlertType]=useState("danger");
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
            setAlertType("success");
            setError("Account Created Successfully");
            history.push("/login");

        }).catch((err)=>{
            setShow(true);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
            else {
                setError(err.message);
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
            setShow(true)
            if (err.response.data && err.response.data.message) {
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

            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Generate Password</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleUserVerificationSubmit}>
                <Modal.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <Input type="password" error={userVerificationDetails.password!=userVerificationDetails.confirm} fullWidth placeholder="Password" name="password" onChange={handleUserVerificationChange} value={userVerificationDetails.password} required />
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                    <Input type="password" error={userVerificationDetails.password!=userVerificationDetails.confirm} fullWidth placeholder="Confirm Password" name="confirm_password" onChange={handleUserVerificationChange} value={userVerificationDetails.confirm} required />
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
                    <Button variant="filled" color="primary" type="submit" onClick={handleClose}>
                        Verify
                    </Button>
                </Modal.Footer>
            </form>
            </Modal>


            <Container className="w-75">
                <SectionTitle title="Create New Account" />
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Input name="name" placeholder="Name.." fullWidth required value={userDetails.name} onChange={handleChange} />
                        </Col>
                        <Col>
                            <Input name="age" placeholder="Age.." fullWidth required value={userDetails.age} type="number" onChange={handleChange} />
                        </Col>
                        <Col>
                            <Form.Select required placeholder="Gender" name="gender" onChange={handleChange} value={userDetails.gender} aria-label="Gender" style={{ "border": "none", "borderBottom": "1px solid black", "borderRadius": "0px" }}>
                                <option>Gender</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input placeholder="Mobile.." name="mobile" fullWidth required value={userDetails.mobile} onChange={handleChange} />
                        </Col>
                        <Col>
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={userDetails.email} onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input fullWidth
                                multiline
                                rows={4}
                                placeholder="Address"
                                required
                                name="address"
                                value={userDetails.address} onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input fullWidth placeholder="Pincode" name="pincode" value={userDetails.pincode} onChange={handleChange} required />
                        </Col>
                        <Col>
                            <Input fullWidth name="city" placeholder="City" required value={userDetails.city} onChange={handleChange} />
                        </Col>
                        <Col>
                            <Input fullWidth name="district" placeholder="District" required value={userDetails.district} onChange={handleChange} />
                        </Col>
                        <Col>
                            <Input fullWidth name="state" placeholder="State" required value={userDetails.state} onChange={handleChange} />
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