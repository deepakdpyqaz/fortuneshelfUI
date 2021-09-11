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

const getTime = (date)=>{
    let dt = new Date(date);
    return `${dt.getDate().toString().padStart(2,'0')}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getFullYear()}`
}
const Order = () => {
    const history = useHistory();
    const admin = useSelector((state) => state.admin.adminDetails);
    const alert = useAlert();
    const today = new Date();
    const [startDate,setStartDate] = useState(`${(today.getFullYear()).toString()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${(today.getDate()).toString().padStart(2,'0')}`);
    const [endDate,setEndDate] = useState(`${(today.getFullYear()).toString()}-${(today.getMonth()+1).toString().padStart(2,'0')}-${(today.getDate()).toString().padStart(2,'0')}`);
    const [searchQuery, setSearchQuery] = useState("");
    const [TransactionData, setTransactionData] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setTransactionData(() => {
            return allTransactions.filter((Transaction) => {
                return ((Transaction.orderId + "").toLowerCase().includes(e.target.value) || (Transaction.transactionId+"")).toLowerCase().includes((e.target.value));
            });
        })
    }
    if (!(admin && admin.id)) {
        history.push("/admin/login")
    }

    const getPayments = ()=>{
        axios.get('/payment/all',{params:{"start":startDate,"end":endDate}}).then((res)=>{
            setAllTransactions(res.data.data);
            setTransactionData(res.data.data);
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
                                <Form.Control type="text" placeholder="Enter transaction Id or Order Id" value={searchQuery} onChange={handleSearchQueryChange} />
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
                        <Button variant="filled" color="primary" onClick={getPayments}>Get Transactions</Button>
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
                                Transaction Id
                            </th>
                            <th className="text-center">
                                Payment Mode
                            </th>
                            <th className="text-center">
                                Status
                            </th>
                            <th className="text-center">
                                Date
                            </th>
                            <th className="text-center">
                                Error (if any)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(TransactionData).map((elem) => {
                            return (
                                <tr key={elem.orderId} className={elem.status=="fail"?"bg-danger text-light":null}>
                                    <td className="text-center">
                                        {elem.orderId}
                                    </td>
                                    <td  className="text-center">
                                        {elem.transactionId?elem.transactionId:"Unknown"}
                                    </td>
                                    <td  className="text-center">
                                        {elem.mode?elem.mode:"Unknown"}
                                    </td>
                                    <td  className="text-center">
                                        {elem.status}
                                    </td>
                                    <td  className="text-center">
                                        {getTime(elem.date)}
                                    </td>
                                    <td className="text-center">
                                        {elem.error?elem.error:"No error"}
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