import React,{useState} from "react";
import { useSelector, connect } from "react-redux";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import SectionTitle from "../../components/SectionTitle";
import Input from "@material-ui/core/Input";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "../../components/Utilities";
const Checkout = (props) => {
    const [shippingDetails,setShippingDetails] = useState({});
    const handleChange=(e)=>{
        setShippingDetails((prevData)=>{
            return {...prevData,[e.target.name]:e.target.value};
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const books = {};
        (Object.entries(props.cartItems != null ? props.cartItems : {})).map((elem)=>{
            books[elem[0]]=elem[1].stock;
        })
        console.log(shippingDetails,books);
    }
    return (
        <div style={{ paddingTop: "10vh" }}>
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
                <SectionTitle title="Shipping Details"/>
                <form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Input name="name" placeholder="Name.." fullWidth required value={shippingDetails.name} onChange={handleChange}/>
                        </Col>
                        <Col>
                            <Input placeholder="Mobile.."  name="mobile" fullWidth required value={shippingDetails.mobile} onChange={handleChange}/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Input placeholder="Email.." name="email" type="email" fullWidth required value={shippingDetails.email} onChange={handleChange}/>
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
                        <Col>
                            <Input fullWidth placeholder="Pincode" name="pincode" value={shippingDetails.pincode} onChange={handleChange} required/>
                        </Col>
                        <Col>
                            <Input fullWidth name="city" placeholder="City" required value={shippingDetails.city} onChange={handleChange} />
                        </Col>
                        <Col>
                            <Input fullWidth name="district" placeholder="District" required value={shippingDetails.district} onChange={handleChange}/>
                        </Col>
                        <Col>
                            <Input fullWidth name="state" placeholder="State" required value={shippingDetails.state} onChange={handleChange}/>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            Payment Method: &nbsp;  COD <input required type="radio" name="paymentMethod" value={"COD"} checked={shippingDetails.paymentMethod=="COD"} onChange={handleChange}   />   &nbsp; Online <input required type="radio" checked={shippingDetails.paymentMethod=="ONLINE"} value={"ONLINE"} onChange={handleChange} name="paymentMethod"  />
                            <br />
                            <small><strong>**Cash On Delivery</strong> is available for registered users Only</small>
                        </Col>
                    </Row>
                    <br/>
                    <br />
                    <Row className="justify-content-center">
                        <Col className="justify-content-center text-center">
                            <Button variant="filled"  color="primary">Submit</Button>
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
    const { cart } = state;
    let tempPrice = 0;
    let weight = 0;
    for (let i in cart.cartItems) {
        tempPrice += cart.cartItems[i].price * cart.cartItems[i].stock;
        weight += cart.cartItems[i].weight * cart.cartItems[i].stock;
    }
    return { cartItems: cart.cartItems, totalPrice: tempPrice, deliveryCharge: Math.ceil(weight / 1000) * 70 }
}
export default connect(mapStateToProps)(Checkout);