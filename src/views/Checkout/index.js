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



const Checkout = (props) => {
    const [shippingDetails, setShippingDetails] = useState({state:"",district:""});
    const dispatch = useDispatch();
    const history = useHistory();
    const alert = useAlert();
    const [billingProfiles, setBillingProfiles] = useState([]);
    const [validation, setValidation] = useState({ first_name: false, last_name: false, mobile: false, email: false, pincode: false,state:false,district:false });
    const [coupon,setCoupon] = useState({});
    const [couponState,setCouponState]=useState("apply");
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
            state: !(data.state && data.state.length>0),
            district: !(data.district && data.district.length>0)
        })

    }

    const handleChange = (e) => {
        setShippingDetails((prevData) => {
            let newData = { ...prevData, [e.target.name]: e.target.value };
            validate(newData);
            return newData;
        })
        if(e.target.name=="pincode" && e.target.value.length=="6" && !isNaN(Number(e.target.value))){
            setShippingDetails((prevData)=>{
                return {...prevData,"state":"","district":""};
            })
            axios.get("https://api.postalpincode.in/pincode/"+e.target.value).then((res)=>{
                res.data=res.data[0];
                if(res.data && res.data.Status=="Success"){
                    if(res.data.PostOffice && res.data.PostOffice.length>0){
                        let state = res.data.PostOffice[0].State;
                        let district = res.data.PostOffice[0].District;
                        setShippingDetails((prevData)=>{
                            return {...prevData,"state":state,"district":district};
                        })
                    }
                }else{
                    setValidation((prevData)=>{
                        return {...prevData,"pincode":true}
                    })
                }
            })
        }
    }
    const disableSubmit = ()=>{
        return Boolean(validation.first_name || validation.last_name || validation.email || validation.mobile || validation.pincode || shippingDetails.state.length==0 || shippingDetails.district.length==0)
    }

    const submitOrder = () => {
        
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if(validation.first_name || validation.last_name || validation.email || validation.mobile || validation.pincode || validation.state || validation.district){
            alert.error("Please fill the details correctly");
            return;
        }
        const books = {};
        (Object.entries(props.cartItems != null ? props.cartItems : {})).map((elem) => {
            books[elem[0]] = elem[1].stock;
        })
        if (Object.entries(books).length == 0) {
            alert.error("No book added");
            return;
        }
        axios.put("/order/make_order", { ...shippingDetails, details: books, amount: props.totalPrice, delivery_charges: props.deliveryCharge,couponId:(coupon.coupon_id?coupon.coupon_id:null)}).then((res) => {
            if(shippingDetails.paymentMode=='C'){
                reactLocalStorage.setObject("cart", {});
                dispatch(setCartItems({}));
                setShippingDetails({});
                history.push(`/order/status?orderId=${res.data.orderId}`);
            }
            else{
                history.push("/confirm_order",{...shippingDetails,orderId:res.data.orderId,details:books,amount:props.totalPrice,delivery_charges:props.deliveryCharge,discount:(coupon.discount?Number(coupon.discount):0)})
            }
        }).catch((err) => {
            if(err.response && err.response.status==409){
                alert.error("Your cart data has been outdated refreshing the cart");
                axios.post("/validate_cart",{cart:props.cartItems}).then((res)=>{
                    reactLocalStorage.setObject("cart",res.data.cart);
                    dispatch(setCartItems(res.data.cart));
                }).catch((err)=>{
                    alert.error("Error in validating cart")
                })
            }
            else if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        })
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
    const applyCoupon = (e)=>{
        e.preventDefault();
        setCouponState("loading");
        axios.get("/payment/apply_coupon/"+coupon.coupon).then((res)=>{
            setCoupon(res.data);
            setCouponState("remove");
        }).catch((err)=>{
            alert.error("Error in applying coupon");
            setCouponState("apply");
        })
    }
    const handleCouponChange = (e)=>{
        setCoupon((prevData)=>{
            return {...prevData,"coupon":e.target.value}
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
    }, [])
    return (
        <div className="view_page">
                
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
                            <td colSpan="5">&#8377; {props.deliveryCharge} /-</td>
                        </tr>
                        <tr>
                            <td>Discount</td>
                            <td colSpan="5">&#8377; {Math.floor(props.deliveryCharge + props.totalPrice)*(coupon.discount?Number(coupon.discount):0)/100} /-</td>
                        </tr>
                        <tr>
                            <td>Total Amount</td>
                            <td colSpan="5">&#8377; {props.deliveryCharge + props.totalPrice-Math.floor((props.deliveryCharge + props.totalPrice)*(coupon.discount?Number(coupon.discount):0)/100)} /-</td>
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
                        <Col md="6" sm="6">
                            <Input name="first_name" placeholder="First Name.." fullWidth required value={shippingDetails.first_name} onChange={handleChange} />
                            {validation && validation.first_name ? <span className="text-danger">Enter a valid first name</span> : null}
                        </Col>
                        <Col md="6" sm="6">
                            <Input name="last_name" placeholder="Last Name.." fullWidth required value={shippingDetails.last_name} onChange={handleChange} />
                            {validation && validation.last_name ? <span className="text-danger">Enter a valid last name</span> : null}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="6" sm="6">
                            <Input placeholder="Mobile.." name="mobile" fullWidth required value={shippingDetails.mobile} onChange={handleChange} />
                            {validation.mobile ? <span className="text-danger">Enter a valid 10 digit mobile number</span> : null}
                        </Col>
                        <Col md="6" sm="6">
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
                        <Col md="3" sm="6">
                            <Input fullWidth placeholder="Pincode" name="pincode" value={shippingDetails.pincode} onChange={handleChange} required />
                            {validation.pincode ? <span className="text-danger">Enter a valid pincode</span> : null}
                        </Col>
                        <Col md="3" sm="6">
                            <Input fullWidth name="city" placeholder="City" required value={shippingDetails.city} onChange={handleChange} />
                        </Col>
                        {
                            shippingDetails.pincode && shippingDetails.pincode.length==6 && !isNaN(Number(shippingDetails.pincode)) && !validation.pincode?
                            <>
                            <Col md="3" sm="6">
                                <Input fullWidth name="district" placeholder="District" required value={shippingDetails.district} onChange={(e)=>{e.preventDefault()}} disabled={!Boolean(shippingDetails.district)} readOnly/>
                            </Col>
                            <Col md="3" sm="6">
                                <Input fullWidth name="state" placeholder="State" required value={shippingDetails.state} onChange={(e)=>{e.preventDefault()}} disabled={!Boolean(shippingDetails.state)} readOnly/>
                            </Col>
                            </>:null
                        }
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                                <Input fullWidth name="coupon" readOnly={couponState!="apply"} placeholder="COUPON" value={coupon.coupon} onChange={handleCouponChange}/>
                        </Col>
                        <Col>
                                {
                                    couponState=="apply"?
                                    <Button variant="filled" color="primary" type="button" onClick={applyCoupon} disabled={!Boolean(coupon.coupon)}>Apply</Button>
                                    :null
                                }
                                {
                                    couponState=="remove"?
                                    <Button variant="filled" color="primary" onClick={(e)=>{e.preventDefault();setCoupon({"coupon":""});setCouponState("apply")}}>Remove</Button>
                                    :null
                                }
                                {
                                    coupon.message?coupon.message:null
                                }
                                {
                                    coupon.discount?<strong><span className="text-success">{`${coupon.discount}% off`}</span></strong>:null
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
        weight += cart.cartItems[i].weight * cart.cartItems[i].stock*cart.cartItems[i].delivery_factor;
    }
    return { cartItems: cart.cartItems, totalPrice: tempPrice, deliveryCharge: Math.ceil(weight / 1000) * 70, userDetails: auth.userDetails }
}
export default connect(mapStateToProps)(Checkout);