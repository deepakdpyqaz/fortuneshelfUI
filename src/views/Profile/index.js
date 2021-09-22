import React, { useEffect, useState } from "react";
import SectionTitle from "../../components/SectionTitle"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import Label from "@material-ui/core/FormLabel";
import Form from "react-bootstrap/Form";
import { useAlert } from "react-alert";
import { Button } from "../../components/Utilities";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import BillingCard from "../../components/BillingCard";
import AddCircleIcon from '@material-ui/icons/AddCircle';
const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Profile = () => {
    const [userDetails, setUserDetails] = useState("");
    const userData = useSelector((state) => state.auth.userDetails);
    const history = useHistory();
    const alert = useAlert();
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) }
    const [billingProfile, setBillingProfile] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [update, setUpdate] = useState(true);
    const [idSelected, setIdSelected] = useState(false);
    const [billingProfiles, setBillingProfiles] = useState([]);
    const classes = useStyles();
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const location = useLocation();
    const [error,setError] = useState(false);
    const resetPassword = () => {
        history.push("/reset_password")
    }
    const handleChange = (e) => {
        setUserDetails((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value }
        })
    };

    const deleteBillingProfile = (id) => {
        setOpenBackdrop(true);
        axios.delete("/user/billing_profile/" + id).then((res) => {
            alert.success("Profile Deleted Succesfully");
            let newProfiles = [];
            for (let profile of billingProfiles) {
                if (profile.id != id) {
                    newProfiles.push(profile);
                }
            }
            setBillingProfiles(newProfiles);
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        }).finally(() => {
            setOpenBackdrop(false);
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);
        axios.post("/user/profile", userDetails).then((res) => {

            alert.success("Updated Succesfully");
        }).catch((err) => {
            alert.error("Error occured in updating profile");
        }).finally(() => {
            setOpenBackdrop(false);
        })
    };
    const handleBillingChange = (e) => {
        setBillingProfile((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value }
        })
        if(e.target.name=="pincode" && e.target.value.length==6 && !isNaN(Number(e.target.value))){
            setBillingProfile((prevData)=>{
                return {...prevData,"state":"","district":""};
            })
            setOpenBackdrop(true);
            axios.get("/pincode/"+e.target.value).then((res)=>{
                if(res.data && res.data.status=="success"){
                    let state = res.data.state;
                    let district = res.data.district;
                    setBillingProfile((prevData)=>{
                        return {...prevData,"state":state,"district":district};
                    })
                }else{
                    setError(true);
                }
            }).catch((err)=>{
                alert.error(err.message);
            }).finally(()=>{
                setOpenBackdrop(false);
            })
        }

    }
    const handleBillingSubmit = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);
        axios({ "method": update ? "post" : "put", "url": update ? "/user/billing_profile/" + idSelected : "/user/billing_profile", data: billingProfile }).then((res) => {
            alert.success(update ? "Profile Added Succesfully" : "Profile Updated Succesfully");
            if (update) {
                setBillingProfiles((prevData) => {
                    return prevData.filter((elem) => {
                        return elem.id != idSelected;
                    })
                })
            }
            setBillingProfiles((prevData) => {
                return [...prevData, { ...billingProfile, "id": res.data.profile_id }].sort((a, b) => { if (a.title < b.title) return -1; else return 1; });
            })
            handleClose();
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
                handleClose();
            }
            else {
                alert.error(err.message);
                handleClose();
            }
        }).finally(() => {
            setBillingProfile({})
            setOpenBackdrop(false);
        })

    }
    const editBillingProfile = (id) => {
        setIdSelected(id);
        for (let pr of billingProfiles) {
            if (pr.id == id) {
                setBillingProfile({
                    "address": pr.address,
                    "pincode": pr.pincode,
                    "title": pr.title,
                    "state": pr.state,
                    "district": pr.district,
                    "city": pr.city,
                })
                setShow(true);
                setUpdate(true);
                break;
            }
        }
    }
    useEffect(() => {
        if (userData && userData.id) {
            setUserDetails(
                {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    mobile: userData.mobile,
                    email: userData.email,
                    age: userData.age,
                    gender: userData.gender
                })
            axios.get("/user/billing_profile").then((res) => {
                setBillingProfiles(res.data.sort((a, b) => { if (a.title < b.title) return -1; else return 1; }));
            }).catch((err) => {
                if (err.status == 401) {
                    history.push("/", { state: { "pathname": location.pathname } });
                }
                else if (err.response && err.response.data) {
                    alert.error(err.response.data.message);
                }
                else {
                    alert.error(err.message);
                }
            })
        }
        else {
            history.push({ pathname: "/", state: { "pathname": location.pathname } });
        }
    }, [])
    return (
        <div className="view_page">
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Billing Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleBillingSubmit}>
                        <Row>
                            <Col md="12" className="my-3">
                                <Label>Title</Label>
                                <Input required value={billingProfile.title} onChange={handleBillingChange} name="title" fullWidth placeholder="Title (e.g Home..)" />
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12" className="my-3">
                                <Label>Address</Label>
                                <Input fullWidth
                                    multiline
                                    rows={4}
                                    placeholder="Address"
                                    required
                                    name="address"
                                    value={billingProfile.address}
                                    onChange={handleBillingChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" sm="6" className="my-3">
                                <Label>Pincode</Label>
                                <Input fullWidth
                                    placeholder="Pincode"
                                    required
                                    name="pincode"
                                    value={billingProfile.pincode}
                                    onChange={handleBillingChange}
                                />
                                {error||(billingProfile.pincode && (billingProfile.pincode.length != 6 || isNaN(billingProfile.pincode))) ? <span className="text-danger">Enter a valid pincode </span> : null}
                            </Col>
                            <Col md="6" sm="6" className="my-3">
                                <Label>City</Label>
                                <Input fullWidth
                                    placeholder="City"
                                    required
                                    name="city"
                                    onChange={handleBillingChange}
                                    value={billingProfile.city}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" sm="6" className="my-3">
                                <Label>District</Label>
                                <Input fullWidth
                                    placeholder="District"
                                    required
                                    name="district"
                                    readOnly
                                    value={billingProfile.district}
                                />
                            </Col>
                            <Col md="6" sm="6" className="my-3">
                                <Label>State</Label>
                                <Input fullWidth
                                    placeholder="State"
                                    required
                                    name="state"
                                    readOnly
                                    value={billingProfile.state}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3 mb-1">
                            <Col className="justify-content-center text-center">
                                <Button color="primary" variant="filled">Submit</Button>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal>
            <Container className="mb-3 pb-3">
                <SectionTitle title={"Welcome " + userDetails.first_name} />
                <form onSubmit={handleSubmit}>
                    <Row className="my-2">
                        <Col md="6" className="my-2">
                            <h4>Mobile: {userDetails.mobile} </h4>
                        </Col>
                        <Col md="6" className="my-2">
                            <h4>Email: {userDetails.email}</h4>
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col md="6" className="my-2">
                            <Label>First Name </Label>
                            <Input name="first_name" placeholder="First Name.." fullWidth required value={userDetails.first_name} onChange={handleChange} />
                        </Col>
                        <Col md="6" className="my-2">
                            <Label>Last Name </Label>
                            <Input name="last_name" placeholder="Last Name.." fullWidth required value={userDetails.last_name} onChange={handleChange} />
                        </Col>
                    </Row>
                    <Row className="my-2">
                        <Col className="my-2">
                            <Label>Age</Label>
                            <Input name="age" placeholder="Age.." fullWidth required value={userDetails.age} type="number" onChange={handleChange} />
                        </Col>
                        <Col className="my-2">
                            <Label>Gender</Label>
                            <Form.Select required placeholder="Gender" name="gender" onChange={handleChange} value={userDetails.gender} aria-label="Gender" style={{ "border": "none", "borderBottom": "1px solid black", "borderRadius": "0px", "background": "transparent" }}>
                                <option></option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button onClick={resetPassword} variant="filled" color="primary">Reset Password</Button>
                        </Col>
                    </Row>
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" color="primary"><h4 className="py-0 my-0">Save Profile </h4></Button>
                        </Col>
                    </Row>
                </form>
            </Container>
            <br />
            <br />
            <Container className="my-3">
                <SectionTitle title="Billing Profile" />
                {
                    userData && billingProfiles.length ?
                        <Container>
                            <Row className="text-center my-3">
                                <Col>
                                    <Button color="primary" variant="filled" onClick={() => {setUpdate(false);setShow(true)}}><h4 className="my-0"><AddCircleIcon /> Add another</h4></Button>
                                </Col>
                            </Row>
                            <Row className="justify-content-start">
                                {billingProfiles.map((profile, ind) => {
                                    return (
                                        <BillingCard deleteBillingProfile={deleteBillingProfile} editBillingProfile={editBillingProfile} key={profile.id} id={profile.id} title={profile.title} index={ind + 1} address={profile.address} district={profile.district} state={profile.state} city={profile.city} pincode={profile.pincode} />
                                    )
                                })}
                            </Row>
                        </Container>
                        : <Container className="text-center my-3">
                            <Button color="primary" variant="filled" onClick={() => setShow(true)}> <h4 className="my-0"> Create a billing Profile</h4></Button>
                        </Container>
                }
            </Container>
        </div>
    )
}

export default Profile;