import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logo from "../../images/logo.png";
import Person from "@material-ui/icons/Person";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import { reactLocalStorage } from 'reactjs-localstorage';
import { CartBook } from "../ViewBook";
import { useSelector, useDispatch, connect } from 'react-redux';
import { Link, useLocation, useHistory } from "react-router-dom";
import { setCartItems } from "../../reducers/cart";
import { logout } from "../../reducers/auth";
import { Button } from "../Utilities";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "./header.scss";
import axios from "axios";
import { useAlert } from "react-alert";
const Header = (props) => {
    const [show, setShow] = useState(false);
    const [cartVisibility, setCartVisibility] = useState(false);
    const showCart = () => setCartVisibility(true);
    const hideCart = () => setCartVisibility(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const headerRef = React.createRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const alert = useAlert();
    const target = useRef();
    const [showSearchTip, setShowSearchTip] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const handleUserClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const location = useLocation();
    const handleUserClose = () => {
        setAnchorEl(null);
    };
    const logoutUser = () =>{
        if(props.userDetails.token){
            axios.post("/user/logout",{token:props.userDetails.token}).then(()=>{
                alert.success("Logged Out succesfully");
                history.push("/")
            }).catch((err)=>{
                alert.error("Problem while Logging Out")
            });
        }
        reactLocalStorage.remove("token");
        dispatch(logout());

    }
    window.addEventListener("scroll", function (e) {
        if (headerRef.current && location.pathname=="/") {
            let height = headerRef.current.getBoundingClientRect().height;
            if (window.scrollY >= height) {
                headerRef.current.classList.add("fs_header_sticky");
            }
            else {
                headerRef.current.classList.remove("fs_header_sticky");
            }
        }
    })
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchQueryChange = (e) => {
        setShowSearchTip(false);
        setSearchQuery(e.target.value);
    }
    const makeSearch = (e) => {
        if (searchQuery.length < 3) {
            setShowSearchTip(true);
            return;
        }
        setSearchQuery("");
        history.push("/search?searchQuery=" + searchQuery);
    }
    useEffect(() => {
        if (location.pathname!="/") {
            headerRef.current.classList.add("fs_header_sticky");
        }
        else{
            headerRef.current.classList.remove("fs_header_sticky");
        }
        const items = reactLocalStorage.getObject('cart');
        dispatch(setCartItems(items));
    }, [location.key])
    return (
        <>
            <Container ref={headerRef} fluid className="fs_header">
                <Row className="align-items-center justify-center">
                    <Col xs={1} className="fs_menu_btn text-center">
                        <Avatar className="fs_menu_avatar">
                            <MenuIcon onClick={handleShow} />
                        </Avatar>
                    </Col>
                    <Col md={1} sm={3} xs={3} className="text-center">
                        <Link to="/"> <img className="fs_logo" src={logo} alt="FortuneShelf" height="55" width="55" /></Link>
                    </Col>
                    <Col md={3} sm={5} xs={4} className="fs_search justify-content-stretch">
                        <SearchIcon ref={target} className="fs_search_btn" onClick={makeSearch} />
                        <Overlay target={target.current} show={showSearchTip} placement="bottom">
                            {(props) => (
                                <Tooltip id="overlay-example" {...props}>
                                    Type atleast four words
                                </Tooltip>
                            )}
                        </Overlay>
                        <input type="text" placeholder="Search your book directly here..." value={searchQuery} onKeyUp={(e)=>{if(e.key=="Enter"){makeSearch()}}} onChange={handleSearchQueryChange} />
                    </Col>
                    <Col className="fs_menu text-right">
                        <div className="d-flex justify-content-end align-items-center">
                            <Link to="/">
                                <div>
                                    Home
                                </div>
                            </Link>
                            <Link to="/viewbook">
                                <div>
                                    View Books
                                </div>
                            </Link>
                            <Link to="/trackorder">
                                <div>
                                Track Order
                                </div>
                            </Link>
                            {
                                (
                                    props.userDetails && props.userDetails.id != null ?
                                        <div className="fs_dropdown">My Activities <ArrowDropDownIcon />
                                            <ul className="fs_dropdown_list">
                                                <Link to="/myorder"><li>My Orders</li></Link>
                                                <Link to="/profile"><li>Profile</li></Link>
                                                <li onClick={logoutUser}>Logout</li>
                                            </ul>
                                        </div> : null
                                )
                            }
                        </div>
                    </Col>
                    <Col md={2} sm={2} xs={4} className="d-flex justify-content-start align-items-center">

                        <Avatar className="fs_avatar" onClick={handleUserClick}>
                            {props.userDetails && props.userDetails.id != null ?
                                props.userDetails.first_name[0] : <Person />
                            }
                        </Avatar>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleUserClose}
                        >
                            {
                                props.userDetails && props.userDetails.id != null ?
                                    <MenuItem onClick={()=>{handleUserClose();logoutUser();}}>Logout</MenuItem> :
                                    [
                                        <Link key="1" to="/login"><MenuItem onClick={handleUserClose}>Login</MenuItem></Link>,
                                        <Link key="2" to="/signup"><MenuItem onClick={handleUserClose}>Sign Up</MenuItem></Link>
                                    ]
                            }
                        </Menu>
                        <Avatar className="fs_avatar">
                            <ShoppingCart onClick={showCart} />
                        </Avatar>
                    </Col>
                </Row>
            </Container>
            <Offcanvas className="fs_sidebar_menu" show={show} onHide={handleClose}>
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>FortuneShelf</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav defaultActiveKey="/" className="fs_sidebar_nav flex-column">
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/">Home</Link>
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/viewbook">View Books</Link>
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/trackorder">Track Order</Link>
                        {
                            props.userDetails && props.userDetails.id?
                            [
                                <Link onClick={handleClose} key="1" className="fs_sidebar_nav_item" to="/myorder" >My Orders</Link>,
                                <Link onClick={handleClose} key="2" className="fs_sidebar_nav_item" to="/profile">Profile</Link>,
                                <Link onClick={handleClose} key="3" className="fs_sidebar_nav_item" onClick={logoutUser} to="#" >Logout</Link>,
                            ]
                            :null
                        }
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
            <Offcanvas show={cartVisibility} onHide={hideCart} scroll={true} backdrop={true} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-center">My Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Offcanvas.Title className="text-center">{Object.keys(props.cartItems).length==0?"No":Object.keys(props.cartItems).length} {Object.keys(props.cartItems).length == 1 ? "Item" : "Items"} Added</Offcanvas.Title>
                    {(Object.entries(props.cartItems != null ? props.cartItems : {})).map(elem => {
                        return <CartBook key={elem[1].bookId} max_stock={elem[1].max_stock} bookId={elem[1].bookId} title={elem[1].title} language={elem[1].language} price={elem[1].price} photo={elem[1].photo} discount={elem[1].discount} qty={elem[1].stock} />;
                    })}
                    <Container className="justify-content-center text-center">
                        <h3>Total: {props.totalPrice}</h3>
                        <Link to={props.totalPrice ? "/checkout" : "#"}><Button variant="filled" color="primary" disabled={!(props.totalPrice)}>Proceed &gt;&gt;</Button></Link>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
function mapStateToProps(state) {
    const { cart, auth } = state;
    let tempPrice = 0;
    for (let i in cart.cartItems) {
        tempPrice += (Math.ceil(cart.cartItems[i].price - cart.cartItems[i].price * cart.cartItems[i].discount / 100)) * cart.cartItems[i].stock;
    }
    return { cartItems: cart.cartItems, totalPrice: tempPrice, userDetails: auth.userDetails }
}
export default connect(mapStateToProps)(Header);