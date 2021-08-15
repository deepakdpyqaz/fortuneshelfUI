import React, { useState } from "react";
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
import "./header.scss";
const Header = () => {
    const [show, setShow] = useState(false);
    const [cartVisibility, setCartVisibility] = useState(false);
    const showCart = () => setCartVisibility(true);
    const hideCart = () => setCartVisibility(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const headerRef = React.createRef();
    window.addEventListener("scroll",function(e){
        if(headerRef.current){
            let height = headerRef.current.getBoundingClientRect().height;
            if(window.scrollY>=height){
                headerRef.current.classList.add("fs_header_sticky");
            }
            else{
                headerRef.current.classList.remove("fs_header_sticky");
            }
        }
    })
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
                        <SearchIcon className="fs_search_btn" />
                        <input type="text" placeholder="Search..." />
                    </Col>
                    <Col className="fs_menu text-right">
                        <div className="d-flex justify-content-end align-items-center">
                            <div>Home</div>
                            <div>About</div>
                            <div>View Books</div>
                            <div>Track Order</div>
                            <div className="fs_dropdown">My Activities <ArrowDropDownIcon />
                                <ul className="fs_dropdown_list">
                                    <li>My Orders</li>
                                    <li>Text 2</li>
                                    <li>Text 3</li>
                                </ul>
                            </div>
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
                    <Offcanvas.Title className="text-center">Cart</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    Cart data will come here
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Header;