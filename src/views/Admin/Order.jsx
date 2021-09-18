import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { Button } from "../../components/Utilities";
import { useAlert } from "react-alert";
import TextField from "@material-ui/core/TextField";

const Order = () => {
    const history = useHistory();
    const admin = useSelector((state) => state.admin.adminDetails);
    const alert = useAlert();
    const today = new Date();
    const [startDate,setStartDate] = useState(`${(today.getFullYear()).toString()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${(today.getDate()).toString().padStart(2,'0')}`);
    const [endDate,setEndDate] = useState(`${(today.getFullYear()).toString()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${(today.getDate()).toString().padStart(2,'0')}`);
    const [searchQuery, setSearchQuery] = useState("");
    const [OrderData, setOrderData] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setOrderData(() => {
            return allOrders.filter((Order) => {
                return ((Order.orderId + "").toLowerCase()).includes((e.target.value).toLowerCase());
            });
        })
    }
    if (!(admin && admin.id)) {
        history.push("/admin/login")
    }

    const getOrders = ()=>{
        axios.get('/order/get_all_orders',{params:{"start":startDate,"end":endDate}}).then((res)=>{
            setAllOrders(res.data.data);
            setOrderData(res.data.data);
        }).catch((err)=>{
            alert.error("Internal Server Error");
        })
    }
    return (
        <div>
            <Container className="my-3 px-3">
                <Row>
                    <Col className="fs_search justify-content-stretch" className="my-2">
                        <Row className="align-items-center gx-1">
                            <Col>
                                <Form.Control type="text" placeholder="Search Order with Order Id" value={searchQuery} onChange={handleSearchQueryChange} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className="fs_search justify-content-stretch" className="my-2">
                        <TextField
                            id="start_date"
                            label="Start Date"
                            type="date"
                            defaultValue={startDate}
                            valuue={startDate}
                            onChange={(e)=>{setStartDate(e.target.value)}}
                            fullWidth
                        />
                    </Col>
                    <Col className="fs_search justify-content-stretch" className="my-2">
                        <TextField
                            id="end_date"
                            label="End Date"
                            type="date"
                            defaultValue={endDate}
                            value={endDate}
                            onChange={(e)=>{setEndDate(e.target.value)}}
                            fullWidth
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant="filled" color="primary" onClick={getOrders}>Get Orders</Button>
                    </Col>
                </Row>
            </Container>
            <Container className="my-3 px-3">
                <Table bordered bordered-dark striped hover responsive>
                    <thead>
                        <tr>
                            <th className="text-center">
                                Order Id
                            </th>
                            <th className="text-center">
                                Email
                            </th>
                            <th className="text-center">
                                Phone
                            </th>
                            <th className="text-center">
                                Payment Method
                            </th>
                            <th className="text-center">
                                Weight
                            </th>
                            <th className="text-center">
                                Amount
                            </th>
                            <th className="text-center">
                                Status
                            </th>
                            <th className="text-center">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(OrderData).map((elem) => {
                            return (
                                <tr key={elem.orderId} className={elem.status=="failed"?"bg-danger text-light":null}>
                                    <td className="text-center">
                                        {elem.orderId}
                                    </td>
                                    <td  className="text-center">
                                        {elem.email}
                                    </td>
                                    <td  className="text-center">
                                        {elem.mobile}
                                    </td>
                                    <td  className="text-center">
                                        {elem.paymentMethod}
                                    </td>
                                    <td  className="text-center">
                                        {elem.weight} Grams
                                    </td>
                                    <td  className="text-center">
                                        &#8377; {elem.amount}
                                    </td>
                                    <td  className="text-center">
                                        {elem.status}
                                    </td>
                                    <td className="text-center">
                                        <Link to={"/admin/order/" + elem.orderId}><Button variant="filled" color="primary" >View</Button></Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>

        </div>
    )
}

export default Order;