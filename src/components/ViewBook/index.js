import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import "./view_book.scss";
import { Button } from "../Utilities";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import NearMeIcon from '@material-ui/icons/NearMe';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useSelector, useDispatch, connect } from "react-redux";
import { setCartItems, makeChange } from "../../reducers/cart";
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Link } from "react-router-dom";
import axios from "axios";
import { Transition as ReactTransitionGroup } from 'react-transition-group';
import { useAlert } from "react-alert";

const CartBook = (props) => {
    const dispatch = useDispatch();
    let cartItems = useSelector((state) => state.cart.cartItems);
    const ChangeQuantity = (qty, bookId) => {
        if (qty == 0) {
            return removeFromCart(bookId);
        }
        cartItems = { ...cartItems }
        let cartItemsLs = reactLocalStorage.getObject('cart');
        cartItemsLs = { ...cartItemsLs };
        dispatch(makeChange())
        cartItems[Number(bookId)] = { ...cartItems[Number(bookId)], stock: qty };
        cartItemsLs[Number(bookId)] = { ...cartItems[Number(bookId)], stock: qty };
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart', cartItemsLs);
    }
    const removeFromCart = (bookId) => {
        let cartItemsLs = reactLocalStorage.getObject('cart');
        cartItemsLs = { ...cartItemsLs };
        cartItems = { ...cartItems }
        delete cartItemsLs[bookId];
        delete cartItems[bookId];
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart', cartItemsLs);
    }
    const [qty, setQty] = useState(props.qty);
    return (
        <Card style={{ width: '200px' }} className="fs_book fs_cart m-3">
            <CancelIcon style={{ position: "absolute", right: "2px", color: "#031F30" }} onClick={() => removeFromCart(props.bookId)} />
            <Card.Body className="text-center my-0 py-0">
                <object data={props.photo?props.photo:props.picture} type="image/jpg" height="100" style={{"objectFit":"contain","maxWidth":"8rem"}}>
                    <img src="https://images-na.ssl-images-amazon.com/images/I/91n7e4ULsKL.jpg" height="100" alt={props.title} />
                </object>
                <Card.Text as="div" className="border-top border-secondary mt-1 mb-0 pt-1 pb-0">
                    <h6 className="fs_book_title my-0">{props.title}</h6>
                    <div className="fs_book_description my-1">
                        <p className="text-capitalize fs_book_language my-0 py-0">{props.language}</p>
                        <strong style={{ "color": "#9b1c31", "fontSize": "1.2rem" }} className="text-right fs_book_price">&#8377; {Math.ceil(props.price - props.price * props.discount / 100)}
                            {props.discount ?
                                <small className="mx-1 text-secondary" style={{ "font-size": "0.8rem" }} ><strike>{props.price}</strike></small> :
                                null
                            }
                        </strong>
                    </div>
                    <ButtonGroup className="mx-1 my-0 py-0">
                        <Button variant="filled" color="primary" onClick={() => {
                            if (qty < props.max_stock) {
                                ChangeQuantity(qty + 1, props.bookId);
                                setQty(qty + 1)
                            }
                        }
                        }>+</Button>
                        <h5 className="mx-2">{qty}</h5>
                        <Button variant="filled" color="primary" disabled={(qty) < 1} onClick={() => {
                            if (qty - 1 >= 0) {
                                ChangeQuantity(qty - 1, props.bookId);
                                setQty(qty - 1)
                            }
                        }}>-</Button>
                    </ButtonGroup>
                </Card.Text>
                <ButtonGroup>
                </ButtonGroup>
            </Card.Body>
        </Card>

    )
}
const Book = (props) => {
    const dispatch = useDispatch();
    const [iconVisible, setIconVisible] = useState("hidden");
    let cartItems = useSelector((state) => state.cart.cartItems);

    const alert = useAlert();
    const ChangeQuantity = (qty, bookId) => {
        if (qty == 0) {
            return removeFromCart(bookId);
        }
        cartItems = { ...cartItems }
        let cartItemsLs = reactLocalStorage.getObject('cart');
        cartItemsLs = { ...cartItemsLs };
        cartItems[Number(bookId)] = { ...cartItems[Number(bookId)], stock: qty };
        cartItemsLs[Number(bookId)] = { ...cartItems[Number(bookId)], stock: qty };
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart', cartItemsLs);
    }
    const removeFromCart = (bookId) => {
        let cartItemsLs = reactLocalStorage.getObject('cart');
        cartItemsLs = { ...cartItemsLs };
        cartItems = { ...cartItems }
        delete cartItemsLs[bookId];
        delete cartItems[bookId];
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart', cartItemsLs);
    }
    const AddToCart = (data) => {
        let previousCart = reactLocalStorage.getObject('cart');

        if (!previousCart[data.bookId]) {
            setIconVisible("visible");
            setTimeout(() => {
                setIconVisible("hidden");
            }, 1000);
            reactLocalStorage.setObject('cart', { ...previousCart, [Number(data.bookId)]: { ...data, "stock": 1 } });
            dispatch(setCartItems({ ...previousCart, [Number(data.bookId)]: { ...data, "stock": 1 } }))
        }
    }
    return (
        <>
            <Card className="fs_book py-1 m-3 justify-content-center">
                {props.delivery_factor == 0 ?
                    <div className="fs_delivery_free">Delivery Free</div> : null
                }
                <ReactTransitionGroup
                    transitionname="fs_book_transition"
                    transitionentertimeout={500}
                    transitionleavetimeout={300}
                    timeout={300}
                >

                    <div className={`fs_added ${iconVisible}`}>
                        <CheckCircleOutlineIcon className="fs_added_icon" />
                    </div>
                </ReactTransitionGroup>
                <Card.Body className="text-center d-flex pb-1 pt-0 flex-column justify-content-between">
                    <Link to={"/viewBook/" + props.bookId} className="pt-1 pb-0 my-0">
                        <object data={props.photo} type="image/png" height="200" style={{"objectFit":"contain","maxWidth":"10rem"}}>
                            <img src="https://images-na.ssl-images-amazon.com/images/I/91n7e4ULsKL.jpg" height="200" style={{"objectFit":"contain","maxWidth":"10rem"}} alt={props.tilte} />
                        </object>
                        <Card.Text as="div" className="border-top border-secondary my-1 pt-1 pb-0">
                            <h6 className="fs_book_title my-0">{props.title.replace(/\( /g,"(").replace(/ \)/g,")")}</h6>
                            <div className="fs_book_description my-1">
                                <p className="text-capitalize fs_book_language my-0 py-0">{props.language}</p>
                                <strong style={{ "color": "#9b1c31", "fontSize": "1.2rem" }} className="text-right fs_book_price">&#8377; {Math.ceil(props.price - props.price * props.discount / 100)}
                                    {props.discount ?
                                        <small className="mx-1 text-secondary" style={{ "font-size": "0.8rem" }} ><strike>{props.price}</strike></small> :
                                        null
                                    }
                                </strong>
                            </div>
                        </Card.Text>
                    </Link>
                    <ButtonGroup className="justify-content-between my-0 px-0">
                        <Link to={"/viewBook/" + props.bookId} className="my-0 py-0 px-0"><Button color="primary" variant="filled">View <NearMeIcon fontSize="small" /> </Button></Link>
                        {
                            props.qty == 0 ?
                                <Button color="primary" variant="filled" onClick={() => { AddToCart(props) }}>Add <AddShoppingCartIcon fontSize="small" /></Button>
                                :
                                <ButtonGroup>
                                    <Button variant="filled" color="primary" onClick={() => {
                                        if (props.qty < props.max_stock) {
                                            ChangeQuantity(props.qty + 1, props.bookId);
                                        }
                                    }
                                    }>+</Button>
                                    <h5 className="mx-1">{props.qty}</h5>
                                    <Button variant="filled" color="primary" disabled={(props.qty) < 0} onClick={() => {
                                        if (props.qty - 1 >= 0) {
                                            ChangeQuantity(props.qty - 1, props.bookId);
                                        }
                                    }}>-</Button>
                                </ButtonGroup>

                        }
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </>
    )
}

const BookContainer = (props) => {
    return (
        <Container fluid className="fs_book_wrapper pb-3">
            <Row className="g-0 justify-content-center">
                {(props.books.map((elem) => {
                    return (
                        <Book key={elem.id} qty={props.cartItems && props.cartItems[elem.book_id] ? props.cartItems[elem.book_id].stock : 0} max_stock={elem.max_stock} title={elem.title} language={elem.language} price={elem.price} discount={elem.discount} photo={elem.picture} weight={elem.weight} bookId={elem.book_id} delivery_factor={elem.delivery_factor} />
                    )
                }))}
            </Row>
        </Container>
    )
}

export { Book, BookContainer, CartBook };