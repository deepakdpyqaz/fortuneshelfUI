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
import { ApiLoader } from "../../components/Loaders";

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: "0px 0px 3px 1px #EBA83A",
      padding: theme.spacing(2, 4, 3),
    },
  }));  
const Checkout = (props) => {
    const [shippingDetails, setShippingDetails] = useState({ state: "", district: "" });
    const dispatch = useDispatch();
    const history = useHistory();
    const alert = useAlert();
    const [deliveryCharge, setDeliveryCharge] = useState(70);
    const [billingProfiles, setBillingProfiles] = useState([]);
    const [validation, setValidation] = useState({ first_name: false, last_name: false, mobile: false, email: false, pincode: false, state: false, district: false });
    const [coupon, setCoupon] = useState({});
    const [couponState, setCouponState] = useState("apply");
    const validate = (data) => {
        const nameRe = /[a-zA-z]{2,45}/;
        const phoneRe = /^[0-9]{10}$/;
        const emailRe = /^(\w|.)+@[a-zA-Z_.]+?\.[a-zA-Z.]{2,3}$/;
        const pincodeRe = /^[0-9]{6}$/;
        setValidation({
            first_name: !nameRe.test(data.first_name) && Boolean(data.first_name),
            last_name: !(nameRe.test(data.last_name)) && Boolean(data.last_name),
            mobile: !phoneRe.test(data.mobile) && Boolean(data.mobile),
            email: !(emailRe.test(data.email)) && Boolean(data.email),
            pincode: !(pincodeRe.test(data.pincode) && Boolean(data.pincode)),
            state: !(data.state && data.state.length > 0),
            district: !(data.district && data.district.length > 0)
        })

    }
    const [isLoading, setIsLoading] = useState(false);
    const [disabled,setDisabled] = useState({"state":true,"district":false});
    const handleChange = (e) => {
        setShippingDetails((prevData) => {
            let newData = { ...prevData, [e.target.name]: e.target.value };
            validate(newData);
            return newData;
        })
        if (e.target.name == "pincode" && e.target.value.length == 6 && !isNaN(Number(e.target.value))) {
            setShippingDetails((prevData) => {
                return { ...prevData, "state": "", "district": "" };
            })
            setIsLoading(true);
            setDisabled({"state":true,"district":true});
            axios.get("/pincode/" + e.target.value).then((res) => {
                if (res.data && res.data.status == "success") {
                    let state = res.data.state;
                    let district = res.data.district;
                    setShippingDetails((prevData) => {
                        return { ...prevData, "state": state, "district": district };
                    })
                }else{
                    setDisabled({'state':false,"district":false})
                }
            }).catch((err) => {
                alert.error(err.message);
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }
    const disableSubmit = () => {
        return Boolean(validation.first_name || validation.last_name || validation.email || validation.mobile || validation.pincode || shippingDetails.state.length == 0 || shippingDetails.district.length == 0)
    }
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [openModal,setOpenModal] = useState(false);
    const handleModalClose = ()=>{
        setOpenModal(false);
    }
    const submitOrder = () => {
        setIsLoading(true);
        setOpenModal(false);
        const books = {};
        (Object.entries(props.cartItems != null ? props.cartItems : {})).map((elem) => {
            books[elem[0]] = elem[1].stock;
        })
        if (Object.entries(books).length == 0) {
            alert.error("No book added");
            return;
        }
        axios.put("/order/make_order", { ...shippingDetails, details: books, amount: props.totalPrice, delivery_charges: props.weight * deliveryCharge, couponId: (coupon.coupon_id ? coupon.coupon_id : null) }).then((res) => {
            if (shippingDetails.paymentMode == 'C') {
                reactLocalStorage.setObject("cart", {});
                dispatch(setCartItems({}));
                setShippingDetails({"state":"","district":""});
                history.push(`/order/status?orderId=${res.data.orderId}`);
            }
            else {
                history.push("/confirm_order", { ...shippingDetails, orderId: res.data.orderId, details: books, amount: props.totalPrice, delivery_charges: props.weight * deliveryCharge, discount: (coupon.discount ? Number(coupon.discount) : 0) })
            }
        }).catch((err) => {
            if (err.response && err.response.status == 409) {
                alert.error("Your cart data has been outdated refreshing the cart");
                axios.post("/validate_cart", { cart: props.cartItems }).then((res) => {
                    reactLocalStorage.setObject("cart", res.data.cart);
                    dispatch(setCartItems(res.data.cart));
                }).catch((err) => {
                    alert.error("Error in validating cart")
                })
            }
            else if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        }).finally(()=>{
            setIsLoading(false);
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation.first_name || validation.last_name || validation.email || validation.mobile || validation.pincode || validation.state || validation.district) {
            alert.error("Please fill the details correctly");
            return;
        }
        setOpenModal(true);
    }
    const handleProfileChange = (profile) => {
        if (profile) {
            setShippingDetails((prevData) => {
                return {
                    ...prevData,
                    address: profile.address,
                    pincode: profile.pincode,
                    city: profile.city,
                    state: profile.state,
                    district: profile.district
                }
            })
        }
    }
    const applyCoupon = (e) => {
        e.preventDefault();
        setCouponState("loading");
        axios.get("/payment/apply_coupon/" + coupon.coupon).then((res) => {
            setCoupon(res.data);
            setCouponState("remove");
        }).catch((err) => {
            alert.error("Error in applying coupon");
            setCouponState("apply");
        })
    }
    const handleCouponChange = (e) => {
        setCoupon((prevData) => {
            return { ...prevData, "coupon": e.target.value }
        })
    }
    useEffect(() => {
        if (props.userDetails && props.userDetails.id) {
            setShippingDetails((prevData) => {
                return {
                    ...prevData,
                    first_name: props.userDetails.first_name,
                    last_name: props.userDetails.last_name,
                    mobile: props.userDetails.mobile,
                    email: props.userDetails.email
                }
            })
            axios.get("/user/billing_profile").then((res) => {
                setBillingProfiles(res.data);
                if (res.data.length) {
                    handleProfileChange(res.data[0]);
                }
            }).catch((err) => {
                alert.error(err.message);
            })
        }
        axios.get("/delivery_charges").then((res) => {
            setDeliveryCharge(res.data.delivery_charges);
        }).catch((err) => {
            alert.error("Internal Server Error");
        })
    }, [])
    const body = (
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Order Confirmation</h2>
          <p id="simple-modal-description">
            Your order is of &#8377;{props.weight * deliveryCharge + props.totalPrice - Math.floor((props.weight * deliveryCharge + props.totalPrice) * (coupon.discount ? Number(coupon.discount) : 0) / 100)} /-
          </p>
          <p id="simple-modal-description" className="d-flex justify-content-around p-0">
            <Button variant="filled" color="primary" onClick={submitOrder}>Proceed</Button>
            <Button variant="filled" color="secondary" onClick={handleModalClose}>Cancel</Button>
          </p>
        </div>
      );
    return (
        <div className="view_page">
            <ApiLoader loading={isLoading} />
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="order-confirmation"
                aria-describedby="order-confirmation"
                disableScrollLock={true}
            >
                {body}
            </Modal>
            <Container className="my-3 px-3">
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
                            <td colSpan="5">&#8377; {props.weight * deliveryCharge} /-</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td colSpan="5">&#8377; {Math.floor((props.weight * deliveryCharge + props.totalPrice) * (coupon.discount ? Number(coupon.discount) : 0) / 100)} /-</td>
                        </tr>
                        <tr>
                            <td>Total Amount</td>
                            <td colSpan="5">&#8377; {props.weight * deliveryCharge + props.totalPrice - Math.floor((props.weight * deliveryCharge + props.totalPrice) * (coupon.discount ? Number(coupon.discount) : 0) / 100)} /-</td>
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
                            <select onChange={(e) => handleProfileChange(billingProfiles[Number(e.target.value)])}>
                                {
                                    billingProfiles.length ?
                                        billingProfiles.map((elem, ind) => {
                                            return (
                                                <option value={ind}>{elem.title}</option>
                                            )
                                        }) :
                                        "No Profiles Added"
                                }
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6" sm="6" className="my-1">
                            <Input name="first_name" placeholder="First Name.." fullWidth required value={shippingDetails.first_name} onChange={handleChange} />
                            {validation && validation.first_name ? <span className="text-danger">Enter a valid first name</span> : null}
                        </Col>
                        <Col md="6" sm="6" className="my-1">
                            <Input name="last_name" placeholder="Last Name.." fullWidth required value={shippingDetails.last_name} onChange={handleChange} />
                            {validation && validation.last_name ? <span className="text-danger">Enter a valid last name</span> : null}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="6" sm="6" className="my-1">
                            <Input placeholder="Mobile.." name="mobile" fullWidth required value={shippingDetails.mobile} onChange={handleChange} />
                            {validation.mobile ? <span className="text-danger">Enter a valid 10 digit mobile number</span> : null}
                        </Col>
                        <Col md="6" sm="6" className="my-1">
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={shippingDetails.email} onChange={handleChange} />
                            {validation.email ? <span className="text-danger">Enter a valid email</span> : null}
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
                        <Col md="3" sm="6"  className="my-1">
                            <Input fullWidth placeholder="Pincode" name="pincode" value={shippingDetails.pincode} onChange={handleChange} required />
                            {validation.pincode ? <span className="text-danger">Enter a valid pincode</span> : null}
                        </Col>
                        <Col md="3" sm="6" className="my-1">
                            <Input fullWidth name="city" placeholder="City" required value={shippingDetails.city} onChange={handleChange} />
                        </Col>
                        {
                            shippingDetails.pincode && shippingDetails.pincode.length == 6 && !isNaN(Number(shippingDetails.pincode)) && !validation.pincode?
                                <>
                                    <Col md="3" sm="6" className="my-1">
                                        <Input fullWidth name="district" placeholder="District" required value={shippingDetails.district} onChange={handleChange} readOnly={Boolean(disabled.district)}  />
                                    </Col>
                                    <Col md="3" sm="6" className="my-1">
                                        <Input fullWidth name="state" placeholder="State" required value={shippingDetails.state} onChange={handleChange} readOnly={Boolean(disabled.state)}  />
                                    </Col>
                                </> : null
                        }
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input fullWidth name="coupon" readOnly={couponState != "apply"} placeholder="COUPON" value={coupon.coupon} onChange={handleCouponChange} />
                        </Col>
                        <Col>
                            {
                                couponState == "apply" ?
                                    <Button variant="filled" color="primary" type="button" onClick={applyCoupon} disabled={!Boolean(coupon.coupon)}>Apply</Button>
                                    : null
                            }
                            {
                                couponState == "remove" ?
                                    <Button variant="filled" color="primary" onClick={(e) => { e.preventDefault(); setCoupon({ "coupon": "" }); setCouponState("apply") }}>Remove</Button>
                                    : null
                            }
                            {
                                coupon.message ? <strong className="text-danger mx-1"> {coupon.message}</strong> : null
                            }
                            {
                                coupon.discount ? <strong><span className="text-success mx-1">{`${coupon.discount}% off`}</span></strong> : null
                            }
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
                            <Button variant="filled" color="primary" disabled={disableSubmit()}>Submit</Button>
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
        weight += cart.cartItems[i].weight * cart.cartItems[i].stock * cart.cartItems[i].delivery_factor;
    }
    return { cartItems: cart.cartItems, totalPrice: tempPrice, weight: Math.ceil(weight / 1000), userDetails: auth.userDetails }
}
export default connect(mapStateToProps)(Checkout);