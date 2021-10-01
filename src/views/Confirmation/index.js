import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import { Button } from "../../components/Utilities";
import SectionTitle from "../../components/SectionTitle";
import Label from "@material-ui/core/FormLabel";
import axios from "axios";
import { useAlert } from "react-alert";
import { useState } from "react";
import sha512 from "js-sha512";
import React,{ useEffect,useRef } from "react";
import ReactDOM from 'react-dom';
import { ApiLoader } from "../../components/Loaders";

const Confirmation = (props) => {
    const location = useLocation();
    const alert = useAlert();
    const [isLoading,setIsLoading] = useState(false);
    const [data, setData] = useState();
    const form = useRef();
    const getKey = (e)=>{
        e.preventDefault();
        setIsLoading(true);
        axios.get("/payment/get_key",{ params: { orderId: location.state.orderId, mobile: location.state.mobile, email: location.state.email } }).then((res)=>{
            setData(res.data);
            const productinfo = React.createElement("input",{"hidden":true,"className":"d-none","readOnly":true,"name":"productinfo",value:res.data.productinfo});
            const merchant_key=React.createElement("input",{"hidden":true,"className":"d-none","value":res.data.merchant_key,"name":"key","readOnly":true});
            const payuId = React.createElement("input",{"hidden":true,"className":"d-none","value":res.data.merchant_key,"name":"payuId","readOnly":true});
            const hash = React.createElement("input",{"hidden":true,"className":"d-none","value":res.data.hash,"name":"hash","readOnly":true});
            const curl = React.createElement("input",{"hidden":true,"className":"d-none","value":res.data.curl,"name":"curl","readOnly":true})
            const furl = React.createElement("input",{"hidden":true,"className":"d-none","value":res.data.furl,"name":"furl","readOnly":true})
            const surl = React.createElement("input",{"hidden":true,"className":"d-none","value":res.data.surl,"name":"surl","readOnly":true})
            const hiddenRow = React.createElement(Row,{"className":"d-none"},[merchant_key,payuId,hash,curl,furl,surl,hash,productinfo]);
            ReactDOM.render(hiddenRow,document.getElementById("fs_inputs_hidden"));
            form.current.submit()
        }).catch((err)=>{
            alert.error("Order cannot be placed");
        }).finally(()=>{
            setIsLoading(false);
        })
    }
    return (
        <div className="view_page" onContextMenu={(e)=>e.preventDefault()} onKeyDown={(e)=>{e.preventDefault()}}>
            <ApiLoader loading={isLoading}/>
            <SectionTitle title="Order Confirmation" />
            <Container className="my-3 py-3">
                <form ref={form} method="post" action={process.env.REACT_APP_PAYU_URL} content-type="application/x-www-form-urlencoded" accept="application/json">
                    <Row>
                        <Col>
                            <Label>Order Id:</Label>
                            <Input name="txnid" placeholder="order Id" fullWidth required value={location.state.orderId} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Label>Amount (in &#8377;):</Label>
                            <Input name="amount" placeholder="amount" type="number" fullWidth required value={(Number(location.state.amount) + Number(location.state.delivery_charges))-Math.floor((Number(location.state.amount) + Number(location.state.delivery_charges))*Number(location.state.discount)/100)} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="6" sm="6">
                            <Label>First Name </Label>
                            <Input name="firstname" placeholder="First Name.." fullWidth required value={location.state.first_name} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                        <Col md="6" sm="6">
                            <Label>Last Name </Label>
                            <Input name="lastname" placeholder="Last Name.." fullWidth required value={location.state.last_name} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="6" sm="6">
                            <Label>Mobile </Label>
                            <Input placeholder="Mobile.." name="phone" fullWidth required value={location.state.mobile} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                        <Col md="6" sm="6">
                            <Label>Email </Label>
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={location.state.email} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Label>Address </Label>
                            <Input fullWidth
                                multiline
                                rows={4}
                                placeholder="Address"
                                required
                                name="address1"
                                value={location.state.address}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="3" sm="6">
                            <Label>Pincode</Label>
                            <Input fullWidth placeholder="Pincode" name="zipcode" value={location.state.pincode} required onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                        <Col md="3" sm="6">
                            <Label>City </Label>
                            <Input fullWidth name="city" placeholder="City" required value={location.state.city} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                        <Col md="3" sm="6">
                            <Label>District </Label>
                            <Input fullWidth placeholder="District" required value={location.state.district} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                        <Col md="3" sm="6">
                            <Label>State</Label>
                            <Input fullWidth name="state" placeholder="State" required value={location.state.state} onChange={(e) => e.preventDefault()} readOnly />
                        </Col>
                    </Row>
                    <br />
                    <Row className="d-none">
                        <input hidden type="text" name="country" value="India" readOnly />
                    </Row>
                    <Row className="d-none" id="fs_inputs_hidden">
                    </Row>
                </form>
                    <br/>
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button onClick={getKey} variant="filled" color="primary">Confirm</Button>
                        </Col>
                    </Row>
            </Container>
        </div>
    )
}
export default Confirmation;