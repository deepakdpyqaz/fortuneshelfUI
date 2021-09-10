import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "react-bootstrap/Row";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import SectionTitle from "../../components/SectionTitle";
import { useAlert } from "react-alert";
import axios from "axios";
import Label from "@material-ui/core/FormLabel";
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from "../../components/Utilities";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const Profile = () => {
    const alert = useAlert();
    const params = useParams();
    const history = useHistory();
    const managerId = params["id"];
    const [data, setData] = useState({});
    const [access, setAccess] = useState(false);
    const admin = useSelector((state) => state.admin.adminDetails);
    if (!(admin && admin.id)) {
        history.push("/admin/login")
    }
    const handleChangeCheck = (e) => {
        setData((prevData) => {
            return { ...prevData, [e.target.name]: !prevData[e.target.name] }
        })
    }
    const handleChange = ((e) => {
        setData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        })
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        if (managerId != 0) {
            axios.post("/manager/profile/" + managerId, data).then((res) => {
                alert.success("Profile Updated Succesfully");
                setAccess(data.users);
                history.push("/admin/login");
            }).catch((err) => {
                alert.error("Error in updating profile");
            })
        }
        else{
            axios.post("/manager/add",data).then((res)=>{
                alert.success("Succesfully Invited");
            }).catch((err)=>{
                alert.error("Error in inviting")
            })
        }
    }
    useEffect(() => {
        if (managerId != 0) {
            axios.get("/manager/profile/" + managerId).then((res) => {
                setData(res.data);
                setAccess(res.data.users);
            }).catch((err) => {
                if(err.response && err.response.data){
                    alert.error(err.response.data.message);
                }
                else{
                    alert.error("An error occured");
                }
            })
        }else{
            setAccess(true);
        }
    }, [])
    return (
        <>
            <Container>
                <SectionTitle title={managerId != 0 ? "Profile" : "Invite"} />
                {managerId != 0 ?
                    <Row>
                        <Col md={6} className="my-3">
                            <h5>Mobile: {data.mobile}</h5>
                        </Col>
                        <Col md={6} className="my-3">
                            <h5>Email: {data.email}</h5>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col md={6} className="my-3">
                            <Label>Mobile</Label>
                            <Input value={data.mobile} fullWidth name="mobile" placeholder="Mobile" required onChange={handleChange} />
                        </Col>
                        <Col md={6} className="my-3">
                            <Label>Email</Label>
                            <Input value={data.email} fullWidth name="email" type="email" placeholder="Email" required onChange={handleChange} />
                        </Col>
                    </Row>
                }
                <br />
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6} className="my-3">
                            <Label>First name</Label>
                            <Input value={data.first_name} fullWidth name="first_name" placeholder="First name" required onChange={handleChange} />
                        </Col>
                        <Col md={6} className="my-3">
                            <Label>Last name</Label>
                            <Input value={data.last_name} fullWidth name="last_name" placeholder="Last name" required onChange={handleChange} />
                        </Col>
                    </Row>
                    <Row>
                        <h6>Permissions</h6>
                        <Col>
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={data.users == true} disabled={!access} onChange={handleChangeCheck} name="users" />}
                                label="Admins"
                            />
                        </Col>
                        <Col>
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={data.books == true} disabled={!access} onChange={handleChangeCheck} name="books" />}
                                label="Books"
                            />
                        </Col>
                        <Col>
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={data.orders == true} disabled={!access} onChange={handleChangeCheck} name="orders" />}
                                label="Orders"
                            />
                        </Col>
                        <Col>
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={data.payment == true} disabled={!access} onChange={handleChangeCheck} name="payment" />}
                                label="Payments"
                            />
                        </Col>
                        <Col>
                            <FormControlLabel
                                control={<Checkbox color="primary" checked={data.coupon == true} disabled={!access} onChange={handleChangeCheck} name="coupon" />}
                                label="Coupons"
                            />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row className="justify-content-center text-center">
                        <Col className="justify-content-center text-center">

                            <Button variant="filled" color="primary" onClick={handleSubmit}>{managerId != 0 ? "Save" : "Invite"}</Button>
                        </Col>
                    </Row>
                </form>
                {
                    managerId != 0 && managerId==admin.id?
                        <Row className="justify-content-center text-center my-3">
                            <Col>
                                <Link to="/admin/reset_password"><Button variant="filled" color="primary"> <h5 className="my-0 py-0">Reset Password</h5></Button></Link>
                            </Col>
                        </Row> : null
                }
            </Container>
        </>
    )
}
export default Profile;