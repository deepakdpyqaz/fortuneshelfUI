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
import { useHistory, useLocation } from "react-router";
import { useSelector } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const AddCoupon = () => {
    const alert = useAlert();
    const history = useHistory();
    const location = useLocation();
    const [data, setData] = useState({});
    const admin = useSelector((state) => state.admin.adminDetails);
    if (!(admin && admin.id)) {
        history.push({pathname:"/admin/login",state:{pathname:location.pathname}});
    }
    const handleChange = ((e) => {
        setData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        })
    })
    const handleSubmit = (e) => {
        e.preventDefault();
            axios.post("/order/coupons/create", data).then((res) => {
                alert.success("Coupon Added succesfully");
            }).catch((err) => {
                alert.error("Error in adding coupon");
            })
    }
    
    return (
        <>
            <Container>
                <SectionTitle title={"Add new coupon"} />
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6} className="my-3">
                            <Label>Cupon</Label>
                            <Input value={data.coupon} fullWidth name="coupon" placeholder="Coupon" required onChange={handleChange} />
                        </Col>
                        <Col md={6} className="my-3">
                            <Label>Discount</Label>
                            <Input value={data.discount} fullWidth name="discount" placeholder="Discount" type="number" required onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row className="justify-content-center text-center">
                        <Col className="justify-content-center text-center">

                            <Button variant="filled" color="primary" onClick={handleSubmit}>Add</Button>
                        </Col>
                    </Row>
                </form>
            </Container>
        </>
    )
}
export default AddCoupon;