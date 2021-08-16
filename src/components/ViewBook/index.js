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
const addToCart = (data) => {
    let previousCart = reactLocalStorage.getObject('cart');
    if (!previousCart[data.bookId]) {
        reactLocalStorage.setObject('cart', { ...previousCart, [data.bookId]: { ...data, "stock": 1 } });
    }
    else {
        alert("Book already added");
    }
}

const CartBook = (props) => {
    const [qty,setQty] = useState(props.qty);
    return (
        <Card style={{ width: '200px' }} className="fs_book fs_cart m-3">
            <Card.Body className="text-center">
                <img src={BookImage} alt="" height="100" />
                <Card.Text as="div" className="border-top border-secondary my-3 py-1">
                    <h6>{props.title}</h6>
                    <h6>Language: {props.language}</h6>
                    <strong>Price: &#8377; {props.price-props.price*props.discount/100}</strong>
                    <ButtonGroup>
                        <Button variant="outlined" color="primary" onClick={()=>{setQty(qty+1)}}>+</Button>
                        <h5>{qty}</h5> 
                        <Button variant="outlined" color="primary" onClick={()=>{setQty(qty-1)}}>-</Button>
                    </ButtonGroup>
                </Card.Text>
                <ButtonGroup>
                </ButtonGroup>
            </Card.Body>
        </Card>

    )
}
const Book = (props) => {
    return (
        <>
            <Card style={{ width: '16rem' }} className="fs_book m-3">
                <Card.Body className="text-center">
                    <img src={BookImage} alt="" height="200" />
                    <Card.Text as="div" className="border-top border-secondary my-3 py-1">
                        <h5>{props.title}</h5>
                        <h6>Language: {props.language}</h6>
                        <strong>Price: &#8377; {props.price - props.price * props.discount / 100}</strong> <small><strike>{props.price + 10}</strike></small>
                    </Card.Text>
                    <ButtonGroup>
                        <Button color="primary" variant="filled">VIEW <NearMeIcon /> </Button>
                        <Button color="primary" variant="filled" onClick={() => { addToCart(props) }}>ADD <AddShoppingCartIcon /></Button>
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
                        <Book key={elem.id} title={elem.title} language={elem.language} price={elem.price} discount={elem.discount} bookId={elem.book_id} />
                    )
                }))}
            </Row>
        </Container>
    )
}
export { Book, BookContainer,CartBook };