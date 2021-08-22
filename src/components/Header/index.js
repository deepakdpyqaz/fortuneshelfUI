import React, { useState, useEffect,useRef} from "react";
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
import { Button } from "../Utilities";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import "./header.scss";
const Header = (props) => {
    const userDetails = useSelector((state) => state.auth.userDetails);
    const [show, setShow] = useState(false);
    const [cartVisibility, setCartVisibility] = useState(false);
    const showCart = () => setCartVisibility(true);
    const hideCart = () => setCartVisibility(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const headerRef = React.createRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const target = useRef();
    const [showSearchTip,setShowSearchTip] = useState(false);
    window.addEventListener("scroll", function (e) {
        if (headerRef.current && props.stickyMode) {
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
        if(searchQuery.length<3){
            setShowSearchTip(true);
            return;
        }
        setSearchQuery("");
        history.push("/search?searchQuery=" + searchQuery);
    }
    useEffect(() => {
        if (!props.stickyMode) {
            headerRef.current.classList.add("fs_header_sticky");
        }
        const items = reactLocalStorage.getObject('cart');
        dispatch(setCartItems(items));
    }, [props.stickyMode])
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
                        <img className="fs_logo" src={logo} alt="FortuneShelf" height="55" width="55" />
                    </Col>
                    <Col md={2} sm={5} xs={4} className="fs_search justify-content-stretch">
                        <SearchIcon ref={target}  className="fs_search_btn" onClick={makeSearch} />
                        <Overlay target={target.current} show={showSearchTip} placement="bottom">
                            {(props) => (
                                <Tooltip id="overlay-example" {...props}>
                                    Type atleast four words
                                </Tooltip>
                            )}
                        </Overlay>
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearchQueryChange} />
                    </Col>
                    <Col className="fs_menu text-right">
                        <div className="d-flex justify-content-end align-items-center">
                            <div>
                                <Link to="/">
                                    Home
                                </Link>
                            </div>
                            <div>
                                <Link to="/viewbook">
                                    View Books
                                </Link>
                            </div>
                            <div>Track Order</div>
                            {
                                (
                                    userDetails.userId == null ?
                                        <div className="fs_dropdown">My Activities <ArrowDropDownIcon />
                                            <ul className="fs_dropdown_list">
                                                <li>My Orders</li>
                                                <li>Profile</li>
                                                <li>Logout</li>
                                            </ul>
                                        </div> : null
                                )
                            }
                        </div>
                    </Col>
                    <Col md={2} sm={2} xs={4} className="d-flex justify-content-start align-items-center">
                        <Avatar className="fs_avatar">
                            <Person />
                        </Avatar>
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
                    <Nav defaultActiveKey="/home" className="fs_sidebar_nav flex-column">
                        <Nav.Link className="fs_sidebar_nav_item" href="/home">Home</Nav.Link>
                        <Nav.Link className="fs_sidebar_nav_item" eventKey="link-1">About</Nav.Link>
                        <Nav.Link className="fs_sidebar_nav_item" eventKey="link-2">View Books</Nav.Link>
                        <Nav.Link className="fs_sidebar_nav_item" eventKey="link-2">Track Order</Nav.Link>
                        <Nav.Link className="fs_sidebar_nav_item" eventKey="link-2">My Orders</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
            <Offcanvas show={cartVisibility} onHide={hideCart} scroll={true} backdrop={false} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-center">My Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {(Object.entries(props.cartItems != null ? props.cartItems : {})).map(elem => {
                        return <CartBook key={elem[1].bookId} max_stock={elem[1].max_stock} bookId={elem[1].bookId} title={elem[1].title} language={elem[1].language} price={elem[1].price} discount={elem[1].discount} qty={elem[1].stock} />;
                    })}
                    <Container className="justify-content-center text-center">
                        <h3>Total: {props.totalPrice}</h3>
                        <Link to={props.totalPrice?"/checkout":"#"}><Button variant="filled" color="primary" disabled={!(props.totalPrice)}>Proceed &gt;&gt;</Button></Link>
                    </Container>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}
function mapStateToProps(state) {
    const { cart } = state;
    let tempPrice = 0;
    for (let i in cart.cartItems) {
        tempPrice += cart.cartItems[i].price * cart.cartItems[i].stock
    }
    return { cartItems: cart.cartItems, totalPrice: tempPrice }
}
export default connect(mapStateToProps)(Header);