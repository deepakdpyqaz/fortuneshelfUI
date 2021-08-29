import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, connect } from "react-redux";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import SectionTitle from "../../components/SectionTitle";
import Input from "@material-ui/core/Input";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "../../components/Utilities";
import axios from "axios";
import { reactLocalStorage } from 'reactjs-localstorage';
import { setCartItems } from "../../reducers/cart";
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useAlert } from "react-alert";
import Label from "@material-ui/core/FormLabel";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #031F30',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const Checkout = (props) => {
    const [shippingDetails, setShippingDetails] = useState({});
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const [orderId, setOrderId] = useState("");
    const [open, setOpen] = useState(false);
    const [copied,setCopied] = useState(false);
    const alert = useAlert();
    const [billingProfiles,setBillingProfiles] = useState([]);
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setShippingDetails((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const books = {};
        (Object.entries(props.cartItems != null ? props.cartItems : {})).map((elem) => {
            books[elem[0]] = elem[1].stock;
        })
        if (Object.entries(books).length == 0) {
            alert.error("No book added");
            return;
        }
        axios.put("/order/make_order", { ...shippingDetails, details: books, amount: props.totalPrice, delivery_charges: props.deliveryCharge }).then((res) => {
            setOrderId(res.data.orderId);
            reactLocalStorage.setObject("cart", {});
            dispatch(setCartItems({}));
            setShippingDetails({});
            handleOpen();
        }).catch((err) => {
            if(err.response && err.response.data && err.response.data.message){
                alert.error(err.response.data.message);
            }
            else{
                alert.error(err.message);
            }
        })
    }
    const handleProfileChange = (profile)=>{
        if(profile){
            setShippingDetails((prevData)=>{
                return {...prevData,
                    address:profile.address,
                    pincode:profile.pincode,
                    city : profile.city,
                    state: profile.state,
                    district : profile.district
                }
            })
        }
    }
    useEffect(()=>{
        if(props.userDetails && props.userDetails.id){
            setShippingDetails((prevData)=>{
                return {...prevData,
                    first_name:props.userDetails.first_name,
                    last_name: props.userDetails.last_name,
                    mobile:props.userDetails.mobile,
                    email:props.userDetails.email
                }
            })
            axios.get("/user/billing_profile").then((res)=>{
                setBillingProfiles(res.data);
                if(res.data.length){
                    handleProfileChange(res.data[0]);
                }
            }).catch((err)=>{
                alert.error(err.message);
            })
        }
    },[])
    return (
        <div className="view_page">
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    onBackdropClick="false"
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <h2 id="transition-modal-title">Your Order is placed Succesfully</h2>
                            <p>Your order Id is:</p>
                            <p id="transition-modal-description">{orderId}</p>
                            <div>
                            <CopyToClipboard text={orderId}
                                onCopy={() => setCopied(true)}>
                                <Button variant="filled" color="primary">{copied?"Copied":"Copy"}</Button>
                            </CopyToClipboard>
                                <Button variant="filled" color="primary" onClick={handleClose}>Done</Button>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
            <Container fluid className="my-3 px-3">
                <SectionTitle title="Order Summary" />
                <Table bordered bordered-dark striped hover responsive>
                    <thead>
                        <tr>
                            <th>
                                Serial Number
                            </th>
                            <th>
                                Title
                            </th>
                            <th>
                                Quantity
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Weight
                            </th>
                            <th>
                                Dimension
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Object.entries(props.cartItems != null ? props.cartItems : {})).map((elem, index) => {
                            return (
                                <tr key={elem[1].bookId}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {elem[1].title}
                                    </td>
                                    <td>
                                        {elem[1].stock}
                                    </td>
                                    <td>
                                        {elem[1].price}
                                    </td>
                                    <td>
                                        {elem[1].weight ? elem[1].weight : 1}
                                    </td>
                                    <td>
                                        {elem[1].dimension ? elem[1].dimension : "Not available"}
                                    </td>
                                </tr>
                            )
                        })}
                        <br />
                        <tr>
                            <td>Price</td>
                            <td colSpan="5">&#8377; {props.totalPrice} /-</td>
                        </tr>
                        <tr>
                            <td>Delivery Charges</td>
                            <td colSpan="5">&#8377; {props.deliveryCharge} /-</td>
                        </tr>
                        <tr>
                            <td>Total Amount</td>
                            <td colSpan="5">&#8377; {props.deliveryCharge + props.totalPrice} /-</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>

            <Container>
                <SectionTitle title="Shipping Details" />
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col md="6" sm="8">
                            <Label><h3>Shop As: &nbsp;</h3></Label>
                            <select onChange={(e)=>handleProfileChange(billingProfiles[Number(e.target.value)])}>
                                {
                                    billingProfiles.length?
                                    billingProfiles.map((elem,ind)=>{
                                        return (
                                            <option value={ind}>{elem.title}</option>
                                        )
                                    }):
                                    "No Profiles Added"
                                }
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6" sm="6">
                            <Input name="first_name" placeholder="First Name.." fullWidth required value={shippingDetails.first_name} onChange={handleChange} />
                        </Col>
                        <Col md="6" sm="6">
                            <Input name="last_name" placeholder="Last Name.." fullWidth required value={shippingDetails.last_name} onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col  md="6" sm="6">
                            <Input placeholder="Mobile.." name="mobile" fullWidth required value={shippingDetails.mobile} onChange={handleChange} />
                        </Col>
                        <Col  md="6" sm="6">
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={shippingDetails.email} onChange={handleChange} />
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
                                value={shippingDetails.address} onChange={handleChange}
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col  md="3" sm="6">
                            <Input fullWidth placeholder="Pincode" name="pincode" value={shippingDetails.pincode} onChange={handleChange} required />
                        </Col>
                        <Col  md="3" sm="6">
                            <Input fullWidth name="city" placeholder="City" required value={shippingDetails.city} onChange={handleChange} />
                        </Col>
                        <Col  md="3" sm="6">
                            <Input fullWidth name="district" placeholder="District" required value={shippingDetails.district} onChange={handleChange} />
                        </Col>
                        <Col  md="3" sm="6">
                            <Input fullWidth name="state" placeholder="State" required value={shippingDetails.state} onChange={handleChange} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            Payment Method: &nbsp;  COD <input required type="radio" disabled={!(props.userDetails && props.userDetails.id != null)} name="paymentMode" value={"C"} checked={shippingDetails.paymentMode == "C"} onChange={handleChange} />   &nbsp; Online <input required type="radio" checked={shippingDetails.paymentMode == "O"} value={"O"} onChange={handleChange} name="paymentMode" />
                            <br />
                            <small><strong>**Cash On Delivery</strong> is available for registered users Only</small>
                        </Col>
                    </Row>
                    <br />
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled" color="primary">Submit</Button>
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
function mapStateToProps(state) {
    const { cart, auth } = state;
    let tempPrice = 0;
    let weight = 0;
    for (let i in cart.cartItems) {
        tempPrice += (Math.ceil(cart.cartItems[i].price - cart.cartItems[i].price * cart.cartItems[i].discount / 100)) * cart.cartItems[i].stock;
        weight += cart.cartItems[i].weight * cart.cartItems[i].stock;
    }
    return { cartItems: cart.cartItems, totalPrice: tempPrice, deliveryCharge: Math.ceil(weight / 1000) * 70, userDetails: auth.userDetails }
}
export default connect(mapStateToProps)(Checkout);