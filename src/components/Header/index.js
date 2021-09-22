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
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Offcanvas from "react-bootstrap/Offcanvas";
import Badge from '@material-ui/core/Badge';
import Nav from "react-bootstrap/Nav";
import { reactLocalStorage } from 'reactjs-localstorage';
import { CartBook } from "../ViewBook";
import { useSelector, useDispatch, connect } from 'react-redux';
import { Link, useLocation, useHistory } from "react-router-dom";
import { setCartItems } from "../../reducers/cart";
import { logout } from "../../reducers/auth";
import { Button } from "../Utilities";
import MenuItem from "@material-ui/core/MenuItem";
import "./header.scss";
import axios from "axios";
import { useAlert } from "react-alert";
import SearchBar from "../SearchBar";
import { setLanguages,setCategories } from "../../reducers/filter";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
    },
    dropdown: {
        position: 'absolute',
        top: 28,
        left: 0,
        zIndex: 1000,
        boxShadow: "0px 0px 3px 1px #000",
        color: "#000",
        borderRadius: "5px",
        transitionDuration: "2s",
        backgroundColor: theme.palette.background.paper,
    },
}));
const Header = (props) => {
    const classes = useStyles();
    const [show, setShow] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [submenu, setSubmenu] = useState(false);
    const languages = useSelector((state)=>state.filter.languages);
    const categories = useSelector((state)=>state.filter.categories);
    const [cartVisibility, setCartVisibility] = useState(false);
    const [filterType, setFilterType] = useState();
    const showCart = () => setCartVisibility(true);
    const hideCart = () => setCartVisibility(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const headerRef = React.createRef();
    const dispatch = useDispatch();
    const history = useHistory();
    const alert = useAlert();
    const target = useRef();
    const userMenuRef = useRef();
    const [showSearchTip, setShowSearchTip] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const location = useLocation();
    const showFilter = (data) => {
        setFilterType((prev) => {
            if (data == prev) {
                return "";
            }
            else {
                return data;
            }
        });
    }
    const toggleSubmenu = () => {
        setSubmenu((data) => {
            return !data;
        })
    }
    const handleUserClose = (event) => {
        setUserMenu(false);
    };
    const handleUserClick = () => {
        setUserMenu((prev => {
            return !prev;
        }));
    }
    const logoutUser = () => {
        if (props.userDetails.token) {
            axios.post("/user/logout", { token: props.userDetails.token }).then(() => {
                alert.success("Logged Out succesfully");
                history.push("/")
            }).catch((err) => {
                alert.error("Problem while Logging Out")
            });
        }
        reactLocalStorage.remove("token");
        dispatch(logout());

    }
    const sticky_disabled = ["/login", "/signup"]
    const [isMobile, setIsMobile] = useState(false);
    window.addEventListener("scroll", function (e) {
        if (headerRef.current && !sticky_disabled.includes(location.pathname)) {
            let height = headerRef.current.getBoundingClientRect().height;
            if (window.scrollY >= height / 2 + 2) {
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
    const sortCart = (a,b) =>{
        if(a[1].title.toUpperCase()<b[1].title.toUpperCase()) return -1;
        return 1;
    }
    useEffect(() => {
        if (window.innerWidth <= 960) {
            setIsMobile(true);
        }
        if (sticky_disabled.includes(location.pathname)) {
            headerRef.current.classList.remove("fs_header_sticky");

        }
        axios.get("/filters").then((res) => {
            dispatch(setLanguages(res.data.languages));
            dispatch(setCategories(res.data.categories))
        }).catch((err) => {
            console.log(err);
            alert.error(err.message);
        })
        const items = reactLocalStorage.getObject('cart');
        dispatch(setCartItems(items));
    }, [location.key])
    return (
        <>
            <SearchBar show={showSearchBar} handleClose={() => { setShowSearchBar(false) }} />
            <Container ref={isMobile ? null : headerRef} fluid className="fs_header py-0 pb-1 px-0 px-0">
                <Row className="align-items-center justify-content-between px-0 gx-0">
                    <Col lg={2} xl={3} md={12} sm={12} xs={12} className="justify-content-center align-items-center my-1 fs_logo_wrapper gx-0">
                        <Link to="/" className="d-flex align-items-center justify-content-center fs_logo_link"> <img className="fs_logo" src={logo} alt="FortuneShelf" height="60" width="70" />
                            <span className="fs_logo_text ml-3">FortuneShelf</span>
                        </Link>
                    </Col>
                    <Col className="fs_menu px-0 gx-0 justify-content-start">
                        <div className="fs_navbar">
                            <div>
                                <Link to="/">
                                    <div>
                                        Home
                                    </div>
                                </Link>
                            </div>
                            <div className="fs_dropdown">
                                View Books
                                <ul className="fs_dropdown_list">
                                    <li onClick={(e) => { showFilter("category") }} className="fs_main_list">Category{filterType == "category" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</li>
                                    {
                                        filterType == "category" ?
                                            <>
                                                <Link key={-1} to={{ pathname: "/viewBook", state: { "category": "","delivery_free":false,"language":"" } }}><li className="text-capitalize">All Books</li></Link>
                                                {
                                                    categories.map((item, ind) => {
                                                        return <Link key={ind} to={{ pathname: "/viewBook", state: { "category": item,"delivery_free":false,"language":""  } }}><li className="text-capitalize">{item}</li></Link>
                                                    })
                                                }
                                            </>
                                            : null
                                    }
                                    <li onClick={(e) => { showFilter("language") }} className="fs_main_list">Language{filterType == "language" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</li>
                                    {
                                        filterType == "language" ?
                                            <>
                                                <Link key={-1} to={{ pathname: "/viewBook", state: { "language": "","delivery_free":false,"category":""  } }}><li className="text-capitalize">All Books</li></Link>
                                                {
                                                    languages.map((item, ind) => {
                                                        return <Link key={ind} to={{ pathname: "/viewBook", state: { "language": item,"delivery_free":false,"category":"" } }}><li className="text-capitalize">{item}</li></Link>
                                                    })
                                                }
                                            </>
                                            : null
                                    }
                                    <Link to={{ pathname: "/viewBook", state: { "delivery_free": true ,"language":"","category":"" } }}><li className="text-capitalize">Delivery Free</li></Link>
                                </ul>
                            </div>
                            <div>
                                <Link to="/trackorder">
                                    <div>
                                        Track Order
                                    </div>
                                </Link>
                            </div>
                            <div>
                                <Link to="/contact">
                                    <div>
                                        Contact Us
                                    </div>
                                </Link>
                            </div>
                            <div>

                                <Link to="/about_author">
                                    <div>
                                        About Author
                                    </div>
                                </Link>
                            </div>
                            {
                                (
                                    props.userDetails && props.userDetails.id != null ?
                                        <div className="fs_dropdown">My Activities
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
                    <Col ref={isMobile ? headerRef : null} md={2} sm={12} xs={12} className="d-flex fs_icon_holder justify-content-center align-items-center">
                        <Avatar className="fs_menu_avatar">
                            <MenuIcon onClick={handleShow} />
                        </Avatar>
                        <Avatar className="fs_avatar">
                            <SearchIcon ref={target} className="fs_search_btn" onClick={() => { setShowSearchBar(true) }} />
                        </Avatar>
                        <ClickAwayListener
                            mouseEvent="onMouseDown"
                            touchEvent="onTouchStart"
                            onClickAway={handleUserClose}
                        >
                            <div className={classes.root}>
                                <Avatar className="fs_avatar" onClick={handleUserClick}>
                                    {props.userDetails && props.userDetails.id != null ?
                                        props.userDetails.first_name[0] : <Person />
                                    }
                                </Avatar>
                                {userMenu ? (
                                    <div className={classes.dropdown}>
                                        {
                                            props.userDetails && props.userDetails.id != null ?
                                                <MenuItem onClick={() => { handleUserClose(); logoutUser(); }}>Logout</MenuItem> :
                                                [
                                                    <Link key="1" to="/login"><MenuItem onClick={handleUserClose}>Login</MenuItem></Link>,
                                                    <Link key="2" to="/signup"><MenuItem onClick={handleUserClose}>Sign Up</MenuItem></Link>
                                                ]
                                        }
                                    </div>

                                ) : null}
                            </div>
                        </ClickAwayListener>
                        <Badge badgeContent={Object.keys(props.cartItems).length || 0} color="secondary" overlap="circular" max={99} anchorOrigin={{ vertical: 'bottom', horizontal: "right" }}>
                            <Avatar className="fs_avatar">
                                <ShoppingCart onClick={showCart} />

                            </Avatar>
                        </Badge>
                    </Col>
                </Row>
            </Container>
            <Offcanvas className="fs_sidebar_menu" show={show} scroll={true} onHide={handleClose}>
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>FortuneShelf</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav defaultActiveKey="/" className="fs_sidebar_nav flex-column">
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/">Home</Link>
                        <Link onClick={toggleSubmenu} className="fs_sidebar_nav_item" to="#">View Books</Link>
                        {
                            submenu ?
                                <>
                                    <li onClick={(e) => { showFilter("category") }} className="fs_main_list">Category{filterType == "category" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</li>
                                    {
                                        filterType == "category" ?
                                        <>
                                        <Link key={-1} to={{ pathname: "/viewBook", state: { "category": "","language":"","delivery_free":false  } }}><li className="text-capitalize">All Books</li></Link>
                                        {
                                            categories.map((item, ind) => {
                                                return <Link key={ind} to={{ pathname: "/viewBook", state: { "category": item ,"language":"","delivery_free":false } }}><li className="text-capitalize">{item}</li></Link>
                                            })
                                        }
                                    </>
                                            : null
                                    }
                                    <li onClick={(e) => { showFilter("language") }} className="fs_main_list">Language{filterType == "language" ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</li>
                                    {
                                        filterType == "language" ?
                                            <>
                                                <Link key={-1} onClick={handleClose} to={{ pathname: "/viewBook", state: { "language": "","category":"","delivery_free":false } }}><li className="text-capitalize">All Books</li></Link>
                                                {
                                                    languages.map((item, ind) => {
                                                        return <Link onClick={handleClose} key={ind} to={{ pathname: "/viewBook", state: { "language": item ,"category":"","delivery_free":false } }}><li className="text-capitalize">{item}</li></Link>
                                                    })
                                                }
                                            </>

                                            : null
                                    }
                                    <Link to={{ pathname: "/viewBook", state: { "delivery_free": true ,"language":"","category":"" } }}><li className="text-capitalize">Delivery Free</li></Link>

                                </>
                                : null
                        }
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/trackorder">Track Order</Link>
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/contact">Contact us</Link>
                        <Link onClick={handleClose} className="fs_sidebar_nav_item" to="/about_author">About Author</Link>
                        {
                            props.userDetails && props.userDetails.id ?
                                [
                                    <Link onClick={handleClose} key="1" className="fs_sidebar_nav_item" to="/myorder" >My Orders</Link>,
                                    <Link onClick={handleClose} key="2" className="fs_sidebar_nav_item" to="/profile">Profile</Link>,
                                    <Link onClick={handleClose} key="3" className="fs_sidebar_nav_item" onClick={logoutUser} to="#" >Logout</Link>,
                                ]
                                : null
                        }
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
            <Offcanvas show={cartVisibility} onHide={hideCart} scroll={true} backdrop={true} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="text-center">My Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Offcanvas.Title className="text-center">{Object.keys(props.cartItems).length == 0 ? "No" : Object.keys(props.cartItems).length} {Object.keys(props.cartItems).length == 1 ? "Item" : "Items"} Added</Offcanvas.Title>
                    {(Object.entries(props.cartItems != null ? props.cartItems : {})).sort(sortCart).map(elem => {
                        return <CartBook key={elem[1].bookId} max_stock={elem[1].max_stock} bookId={Number(elem[1].bookId)} title={elem[1].title} language={elem[1].language} price={elem[1].price} photo={elem[1].photo || elem[1].picture} discount={elem[1].discount} qty={elem[1].stock} />;
                    })}
                    <Container className="justify-content-center text-center">
                        <h3>Total: {props.totalPrice}</h3>
                        <Link to={props.totalPrice ? "/checkout" : "#"} onClick={hideCart}><Button variant="filled" color="primary" disabled={!(props.totalPrice)}>Proceed &gt;&gt;</Button></Link>
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