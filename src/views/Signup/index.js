import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import { Button } from "../../components/Utilities";
import SectionTitle from "../../components/SectionTitle";
import axios from "axios";
import { useAlert } from "react-alert";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";
import ResendOtp from "../../components/ResendOtp";
import { ApiLoader } from "../../components/Loaders";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { FormLabel } from "@material-ui/core";
const Signup = () => {
    const [userDetails, setUserDetails] = useState({});
    const alert = useAlert();
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [agree,setAgree] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userVerificationDetails, setUserVerificationDetails] = useState({});
    const handleClose = () => setShow(false);
    const history = useHistory();
    const [validation, setValidation] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const handleCheckChange = (e) => {
        setAgree((data)=>{
            return !data;
        })
    }
    const isUserFormDisabled = () => {
        return Boolean(validation.first_name || validation.last_name || validation.mobile || validation.email || validation.age || validation.gender || !agree)
    }
    const isVerificationDisabled = () => {
        return Boolean(validation.password || validation.confirm_password || validation.otp)
    }
    const validate = (data) => {
        if (data.password) {
            const otpRe = /^[0-9]{4,8}$/;
            setValidation({
                password: data.password.length <= 4 && data.password,
                confirm_password: data.password != data.confirm_password,
                otp: !otpRe.test(data.otp) && data.otp
            })
        }
        else {
            const nameRe = /[a-zA-z]{2,45}/;
            const phoneRe = /^[0-9]{10}$/;
            const emailRe = /^(\w|.)+@[a-zA-Z_.]+?\.[a-zA-Z.]{2,3}$/;
            setValidation({
                first_name: !nameRe.test(data.first_name) && data.first_name,
                last_name: !(nameRe.test(data.last_name)) && data.last_name,
                mobile: !phoneRe.test(data.mobile) && data.mobile,
                email: !(emailRe.test(data.email)) && data.email,
                age: (data.age < 1 || data.age > 120) && data.age,
                gender: data.gender != "M" && data.gender != "F" && data.gender != "O" && data.gender
            })
        }
    }
    const handleUserVerificationChange = (e) => {
        setUserVerificationDetails((prevData) => {
            let newData = { ...prevData, [e.target.name]: e.target.value };
            validate(newData);
            return newData;
        })
    }
    const handleUserVerificationSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post("/user/reset_password", userVerificationDetails).then((res) => {
            setShowModal(false);
            alert.success("Account Created Succesfully")
            history.push("/login");

        }).catch((err) => {
            setShow(true);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
            else {
                setError(err.message)
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }
    const handleSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault()
        axios.post("/user/signup", userDetails).then((res) => {
            setUserVerificationDetails((prevData) => {
                return { ...prevData, userId: res.data.userId, isVerfied: false }
            })
            setShowModal(true);
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }
    const handleChange = (e) => {
        setUserDetails((prevData) => {
            let newData = { ...prevData, [e.target.name]: e.target.value };
            validate(newData);
            return newData;
        })
    }
    return (
        <div className="view_page">
            <ApiLoader loading={isLoading} />
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Generate Password</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleUserVerificationSubmit}>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col>
                                    {error ? <span className="text-danger">{error}</span> : ""}
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Input type="password" error={validation.password} minLength="5" fullWidth placeholder="Password" name="password" onChange={handleUserVerificationChange} value={userVerificationDetails.password} required />
                                    {validation.password ? <span className="text-danger">Password must be of 5 characters</span> : null}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Input type="password" error={validation.confirm_password} fullWidth placeholder="Confirm Password" name="confirm_password" onChange={handleUserVerificationChange} value={userVerificationDetails.confirm} required />
                                    {validation.confirm_password ? <span className="text-danger">Passwords do not matched</span> : null}
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Input type="text" error={validation.otp} fullWidth placeholder="Enter Otp received on mobile/Email" name="otp" onChange={handleUserVerificationChange} value={userVerificationDetails.otp} required />
                                    {validation.otp ? <span className="text-danger">Enter a valid otp</span> : null}
                                </Col>
                            </Row>
                            <br />
                            <Row className="my-1">
                                <Col>

                                    <ResendOtp email={userDetails.email} mobile={userDetails.mobile} isVerified={false} />
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="filled" disabled={isVerificationDisabled()} color="primary" type="submit" onClick={handleClose}>
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
                            {validation.first_name ? <span className="text-danger">Enter a valid first name</span> : null}
                        </Col>
                        <Col md="6" className="my-2">
                            <Input name="last_name" placeholder="Last Name.." fullWidth required value={userDetails.last_name} onChange={handleChange} />
                            {validation.last_name ? <span className="text-danger">Enter a valid last name</span> : null}
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col md="6" className="my-2">
                            <Input placeholder="Mobile.." name="mobile" fullWidth required value={userDetails.mobile} onChange={handleChange} />
                            {validation.mobile ? <span className="text-danger">Enter a valid 10 digit mobile number</span> : null}
                        </Col>
                        <Col md="6" className="my-2">
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={userDetails.email} onChange={handleChange} />
                            {validation.email ? <span className="text-danger">Enter a valid email</span> : null}
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col className="mb-2 mt-3">
                            <Input name="age" placeholder="Age.." fullWidth required value={userDetails.age} type="number" onChange={handleChange} />
                            {validation.age ? <span className="text-danger">Enter a valid age</span> : null}
                        </Col>
                        <Col className="mb-2 mt-0 pt-0">
                            <FormControl fullWidth className={userDetails.gender ? "my-3" : "py-0 my-0"}>
                                {userDetails.gender ? null :
                                    <InputLabel id="demo-simple-select-label" >Gender</InputLabel>
                                }
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={userDetails.gender}
                                    label="Gender"
                                    onChange={handleChange}
                                    name="gender"
                                >
                                    <MenuItem value={"M"}>Male</MenuItem>
                                    <MenuItem value={"F"}>Female</MenuItem>
                                    <MenuItem value={"O"}>Others</MenuItem>
                                </Select>
                            </FormControl>
                            {validation.gender ? <span className="text-danger">Select a valid gender type</span> : null}
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col>
                                <Checkbox
                                    checked={agree}
                                    onChange={handleCheckChange}
                                    inputProps={{ 'aria-label': 'primary checkbox','name':'agree' }}
                                    color={"primary"}
                                    required
                                />
                                <FormLabel htmlFor="agree">I agree to all the terms and conditions and policies of FortuneShelf</FormLabel>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" color="primary" disabled={isUserFormDisabled()}><h3>Submit</h3></Button>
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