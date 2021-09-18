import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Input from "@material-ui/core/Input";
import Label from "@material-ui/core/FormLabel";
import { useParams } from "react-router";
import { useAlert } from "react-alert";
import SectionTitle from "../../components/SectionTitle";
import { Button } from "../../components/Utilities";
import Table from "react-bootstrap/Table";
import InputLabel from '@material-ui/core/InputLabel';
import { useHistory, Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";

const OrderView = () => {
    const params = useParams();
    const orderId = params["orderId"];
    const [data, setData] = useState({ details: {} });
    const [orderStatus, setOrderStatus] = useState(0);
    const [courierInfo,setCourierInfo] = useState({});
    const [show, setShow] = useState(false);
    const alert = useAlert();
    const history = useHistory();
    const admin = useSelector((state) => state.admin.adminDetails);
    const [message,setMessage] = useState("");
    if (!(admin && admin.id)) { 
        history.push("/admin/login")
    }
    const handleChange = (e) => {
        setOrderStatus(e.target.value);
    }

    const handleCourierInfoChange = (e) => {
        setCourierInfo((data)=>{
            return {...data,[e.target.name]:e.target.value};
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("/order/status/" + orderId, { "status": orderStatus,...courierInfo,"message":message }).then((res) => {
            alert.success("Updated Succesfully");
            data.status=orderStatus;
        }).catch((err) => {
            if (err.response && err.response.data) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error("Error in updating book")
            }
        }).finally(() => {
            setShow(false);
        })
    }
    useEffect(() => {
        axios.get("/order/order_by_id/" + orderId).then((res) => {
            if (res.data.status) {
                setOrderStatus(res.data.status);
                setCourierInfo({"courier_tracking_id":res.data.courier_tracking_id,"courier_tracking_url":res.data.courier_url,"courier_name":res.data.courier_name});
            }
            setData(res.data);
        }).catch((err) => {
            if (err.response && err.response.data) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error("Internal Server Error");
            }
        })
    }, [])
    return (
        <>
            <Container className="py-3">
                <Modal show={show} onHide={() => { setShow(false) }} backdrop="static" keyboard={false} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Order Update</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Input fullWidth multiline placeholder={`Order update for orderId ${orderId} (Optional message..)`} rows={4} value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
                        <br/>
                        {
                            (orderStatus < data.status ? <p className="text-danger">You are degrading the order status. Please be sure to take the action</p> : null)
                        }
                        {
                            (orderStatus == data.status ? <p>No changes made in the order status</p> : null)
                        }
                        {
                            (orderStatus > data.status ? <p>Are you sure want to update</p> : null)
                        }

                    </Modal.Body>
                    <Modal.Footer className="justify-content-around">
                        <Button variant="filled" color="primary" onClick={() => { setShow(false) }}>Cancel</Button>
                        <Button variant="filled" color="primary" onClick={handleSubmit} disabled={orderStatus == data.status}>Update Status</Button>
                    </Modal.Footer>
                </Modal>
                <SectionTitle title={"Order ID: " + orderId} />
                <Row>
                    <Col>
                        <h4 className="my-2">Update Order Status</h4>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={12}>
                        <FormControl fullWidth>
                            <InputLabel id="order-status-label">Order Status</InputLabel>
                            <br />
                            <Select
                                labelId="order-status-label"
                                id="order-status"
                                value={orderStatus}
                                name="status"
                                fullWidth
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Pending</MenuItem>
                                <MenuItem value={1}>Packed</MenuItem>
                                <MenuItem value={2}>Shipped</MenuItem>
                                <MenuItem value={3}>Delivered</MenuItem>
                                <MenuItem value={-1}>Failed</MenuItem>
                            </Select>
                        </FormControl>
                            <br />
                            <br />
                            <Row>
                                <Col>
                                    <Label id="order-courier-name">Courier Name</Label>
                                    <Input fullWidth name="courier_name" onChange={handleCourierInfoChange} value={courierInfo.courier_name} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Label id="order-tracking-url">Tracking URL</Label>
                                    <Input fullWidth name="courier_url" onChange={handleCourierInfoChange} value={courierInfo.courier_tracking_url} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Label id="order-tracking-id">Tracking Id</Label>
                                    <Input fullWidth name="courier_tracking_id" onChange={handleCourierInfoChange} value={courierInfo.courier_tracking_id} />
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                    <Button color="primary" variant="filled" onClick={() => { setShow(true) }}>Update</Button>
                                </Col>
                            </Row>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <h4 className="my-2">Payment Details</h4>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={3} sm={6} xs={12} className="my-3">
                        <Label>Payment Mode</Label>
                        <Input fullWidth readOnly value={data.paymentMode == "O" ? "Online" : "COD"} />
                    </Col>
                    <Col md={3} sm={6} xs={12} className="my-3">
                        <Label>Amount (in &#8377;)</Label>
                        <Input fullWidth readOnly value={data.amount} />
                    </Col>
                    <Col md={3} sm={6} xs={12} className="my-3">
                        <Label>Delivery Charges (in &#8377;)</Label>
                        <Input fullWidth readOnly value={data.delivery_charges} />
                    </Col>
                    <Col md={3} sm={6} xs={12} className="my-3">
                        <Label>Discount (in &#8377;)</Label>
                        <Input fullWidth readOnly value={data.discount} />
                    </Col>
                    <Col md={3} sm={6} xs={12} className="my-3">
                        <Label>Total amount (in &#8377;)</Label>
                        <Input fullWidth readOnly value={data.delivery_charges + data.amount - data.discount} />
                    </Col>
                    <Col md={3} sm={6} xs={12} className="my-3">
                        <Label>Nimbus order number</Label>
                        <Input fullWidth readOnly value={data.trackingId} />
                    </Col>
                    {
                        data.paymentMode == "O" ?
                            <>
                                <Col md={3} sm={6} xs={12} className="my-3">
                                    <Label>Transaction Id</Label>
                                    <Input fullWidth readOnly value={data.transactionId ? data.transactionId : "Not Applicable"} />
                                </Col>
                                <Col md={3} sm={6} xs={12} className="my-3">
                                    <Label>Status</Label>
                                    <Input fullWidth readOnly value={data.paymentMode == "O" ? data.paymentStatus : "Not Applicable"} />
                                </Col>
                                {
                                    data.paymentStatus == "fail" ?
                                        <Col md={3} sm={6} xs={12} className="my-3">
                                            <Label>Error</Label>
                                            <Input fullWidth readOnly value={data.error ? data.error : "Unknown Error"} />
                                        </Col>
                                        : null
                                }
                            </>
                            : null
                    }
                </Row>
                <br />
                <Row>
                    <Col>
                        <h4 className="my-2">Shipping Details</h4>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={6} className="my-3"    >
                        <Label>Weight</Label>
                        <Input fullWidth value={data.weight} name="weight" readOnly onChange={handleChange} />
                    </Col>
                    <Col md={6} className="my-3">
                        <Label>Dimension</Label>
                        <Input fullWidth value={data.dimension} name="dimension" readOnly onChange={handleChange} />
                    </Col>
                </Row>
                <Row>
                    <Col md={6} className="my-3"    >
                        <Label>First name</Label>
                        <Input fullWidth value={data.first_name} name="firstname" readOnly onChange={handleChange} />
                    </Col>
                    <Col md={6} className="my-3">
                        <Label>Last name</Label>
                        <Input fullWidth value={data.last_name} name="lastname" readOnly onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={6} className="my-3">
                        <Label>Mobile</Label>
                        <Input fullWidth value={data.mobile} name="mobile" readOnly onChange={handleChange} />
                    </Col>
                    <Col md={6} className="my-3">
                        <Label>Email</Label>
                        <Input fullWidth value={data.email} name="email" readOnly onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Address</Label>
                        <Input fullWidth value={data.address} readOnly multiline rows={4} name="address" onChange={handleChange} />
                    </Col>
                </Row>

                <br />
                <Row>
                    <Col md="3" sm="6">
                        <Label>Pincode</Label>
                        <Input fullWidth placeholder="Pincode" name="pincode" value={data.pincode} onChange={handleChange} readOnly />
                    </Col>
                    <Col md="3" sm="6">
                        <Label>City</Label>
                        <Input fullWidth name="city" placeholder="City" readOnly value={data.city} onChange={handleChange} />
                    </Col>
                    <Col md="3" sm="6">
                        <Label>District</Label>
                        <Input fullWidth name="district" placeholder="District" readOnly value={data.district} onChange={handleChange} />
                    </Col>
                    <Col md="3" sm="6">
                        <Label>State</Label>
                        <Input fullWidth name="state" placeholder="State" readOnly value={data.state} onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <br />
                <Row >
                    <Col>
                        <h4 className="my-3 ">Order Details</h4>

                        <Table bordered responsive hover className="text-center justify-content-center">
                            <thead>
                                <tr>
                                    <th>
                                        Serial Number
                                    </th>
                                    <th>
                                        Book Id
                                    </th>
                                    <th>
                                        Quantity
                                    </th>
                                    <th>
                                        View
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.details).map((elem, index) => {
                                    return (
                                        <tr>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                {elem[0]}
                                            </td>
                                            <td>
                                                {elem[1]}
                                            </td>
                                            <td>
                                                <Link to={"/viewBook/" + elem[0]}><Button variant="filled" color="primary">View</Button></Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

            </Container>
        </>
    )
}
export default OrderView;