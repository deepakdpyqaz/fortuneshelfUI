import React,{useState} from "react";   
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import "./view_book.scss";
import BookImage from "../../images/book.webp";
import { Button } from "../Utilities";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import NearMeIcon from '@material-ui/icons/NearMe';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useSelector,useDispatch } from "react-redux";
import { setCartItems } from "../../reducers/cart";
import CancelIcon from '@material-ui/icons/Cancel';
import {Link} from "react-router-dom";


const CartBook = (props) => {
    const dispatch = useDispatch();
    let cartItems = useSelector((state)=>state.cart.cartItems);
    const ChangeQuantity = (qty,bookId) =>{
        cartItems={...cartItems}
        let cartItemsLs = reactLocalStorage.getObject('cart');
        cartItemsLs={...cartItemsLs};
        
        cartItems[bookId]={...cartItems[bookId],stock:qty};
        cartItemsLs[bookId]={...cartItems[bookId],stock:qty};
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart',cartItemsLs);
    }
    const removeFromCart = (bookId)=>{
        let cartItemsLs = reactLocalStorage.getObject('cart');
        cartItemsLs={...cartItemsLs};
        cartItems={...cartItems}
        delete cartItemsLs[bookId];
        delete cartItems[bookId];
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart',cartItemsLs);
    }
    const [qty,setQty] = useState(props.qty);
    return (
        <Card style={{ width: '200px'}} className="fs_book fs_cart m-3">
            <CancelIcon style={{position:"absolute",right:"2px",color:"#031F30"}} onClick={()=> removeFromCart(props.bookId)}/>
            <Card.Body className="text-center">
                <img src={BookImage} alt="" height="100" />
                <Card.Text as="div" className="border-top border-secondary my-3 py-1">
                    <h6>{props.title}</h6>
                    <h6>Language: {props.language}</h6>
                    <strong>Price: &#8377; {props.price-props.price*props.discount/100}</strong>
                    <ButtonGroup>
                        <Button variant="outlined" color="primary" onClick={()=>{
                            if(qty<props.max_stock){
                                ChangeQuantity(qty+1,props.bookId);
                                setQty(qty+1)}
                            }
                        }>+</Button>
                        <h5>{qty}</h5> 
                        <Button variant="outlined" color="primary" disabled={(qty)<1} onClick={()=>{
                            if(qty-1>=1){
                                ChangeQuantity(qty-1,props.bookId);
                                setQty(qty-1)
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
    const AddToCart = (data) => {
        let previousCart = reactLocalStorage.getObject('cart');
        if (!previousCart[data.bookId]) {
            reactLocalStorage.setObject('cart', { ...previousCart, [data.bookId]: { ...data, "stock": 1 } });
            dispatch(setCartItems({ ...previousCart, [data.bookId]: { ...data, "stock": 1 } }))
        }
        else {
            alert("Book already added");
        }
    }
    return (
        <>
            <Card style={{ width: '16rem' }} className="fs_book m-3">
                {   props.delivery_factor==0?  
                    <div className="fs_delivery_free">Delivery Free</div>:null
                }
                <Card.Body className="text-center">
                    <img src={BookImage} alt="" height="200" />
                    <Card.Text as="div" className="border-top border-secondary my-3 py-1">
                        <h5>{props.title}</h5>
                        <h6>Language: {props.language}</h6>
                        <strong>Price: &#8377; {props.price - props.price * props.discount / 100}</strong> <small><strike>{props.price + 10}</strike></small>
                    </Card.Text>
                    <ButtonGroup>
                        <Link to={"/viewBook/"+props.bookId}><Button color="primary" variant="filled">VIEW <NearMeIcon /> </Button></Link>
                        <Button color="primary" variant="filled" onClick={() => { AddToCart(props) }}>ADD <AddShoppingCartIcon /></Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </>
    )
}

const BookContainer = (props) => {

    return (
        <Container className="fs_book_wrapper pb-3">
            <Row xs={1} md={2} className="g-0 justify-content-center">
                {(props.books.map((elem) => {
                    return (
                        <Book key={elem.id} max_stock={elem.max_stock} title={elem.title} language={elem.language} price={elem.price} discount={elem.discount} weight={elem.weight} bookId={elem.book_id} delivery_factor={elem.delivery_factor} />
                    )
                }))}
            </Row>
        </Container>
    )
}
export { Book, BookContainer,CartBook };