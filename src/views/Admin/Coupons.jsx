import React, { useState, useEffect } from "react";
import SectionTitle from "../../components/SectionTitle"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../components/Utilities";
import axios from "axios";
import { useAlert } from "react-alert";
const getTime = (date) => {
    let dt = new Date(date);
    console.log(dt);
    return `${dt.getDate().toString().padStart(2, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getFullYear()}`
}
const Coupons = () => {
    const history = useHistory();
    const alert = useAlert();
    const admin = useSelector((state) => state.admin.adminDetails);
    const [couponData, setCouponData] = useState([]);
    const deleteCoupon = (couponId) => {
        axios.delete("/order/coupons/" + couponId).then((res) => {
            alert.success("Coupon Deleted succesfully");
            setCouponData((prevData) => {
                return prevData.filter((elem) => {
                    return elem.id != couponId;
                })
            })
        }).catch((err) => {
            alert.error("Error in deleting coupon");
        })
    }
    if (!(admin && admin.id)) {
        history.push("/admin/login")
    }
    useEffect(() => {
        axios.get("/order/coupons/all").then((res) => {
            setCouponData(res.data);
        }).catch((err) => {
            alert.error("Error in fetching coupons");
        })
    }, [])
    return (
        <>
            <SectionTitle title="Coupons" />

            <Container className="my-3 px-3">
                <Row className="my-3">
                    <Col md={12}>
                        <Link to="/admin/coupons/add"><Button variant="filled" color="primary">Add New</Button></Link>
                    </Col>
                </Row>
                <Table bordered bordered-dark striped hover responsive>
                    <thead>
                        <tr>
                            <th className="text-center">
                                Serial
                            </th>
                            <th className="text-center">
                                Coupon
                            </th>
                            <th className="text-center">
                                Discount
                            </th>
                            <th className="text-center">
                                Usage
                            </th>
                            <th className="text-center">
                                Generated On
                            </th>
                            <th className="text-center">
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(couponData).map((elem, index) => {
                            return (
                                <tr key={elem.id} className={elem.isValid == false ? "bg-warning text-light" : null}>
                                    <td className="text-center">
                                        {index + 1}
                                    </td>
                                    <td className="text-center">
                                        {elem.coupon}
                                    </td>
                                    <td className="text-center">
                                        {elem.discount + " %"}
                                    </td>
                                    <td className="text-center">
                                        {elem.usage}
                                    </td>
                                    <td className="text-center">
                                        {getTime(elem.generated_on)}
                                    </td>
                                    <td className="text-center">
                                        <Button variant="filled" color="primary" onClick={() => { deleteCoupon(elem.id) }} >Delete</Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>

        </>
    )
}

export default Coupons;