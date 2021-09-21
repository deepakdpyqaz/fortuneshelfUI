import React, { useState, useEffect } from "react";
import { useParams,useHistory } from 'react-router-dom';
import axios from "axios";
import { ViewBookLoader } from "../../components/Loaders";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import SectionTitle from "../../components/SectionTitle";
import { Button } from "../../components/Utilities";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useSelector, useDispatch, connect } from "react-redux";
import { setCartItems } from "../../reducers/cart";
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import HorizontalSlider from "../../components/HorizontalSlider";

import "./viewfullbook.scss";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: 1000,
        color: '#333',
        opacity: 0.6,
    },
}));

const ViewFullBook = (props) => {
    const { bookId } = useParams();
    const [bookData, setBookData] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const [similarBooks,setSimilarBooks] = useState([]);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const history = useHistory();
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    const ChangeQuantity = (qty, bookId) => {
        if (qty == 0) {
            return removeFromCart(bookId);
        }
        let cartItems = { ...props.cartItems }
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
        let cartItems = { ...props.cartItems }
        delete cartItemsLs[bookId];
        delete cartItems[bookId];
        dispatch(setCartItems(cartItems));
        reactLocalStorage.setObject('cart', cartItemsLs);
    }

    const AddToCart = (data) => {

        let previousCart = reactLocalStorage.getObject('cart');
        if (!previousCart[data.bookId]) {
            reactLocalStorage.setObject('cart', { ...previousCart, [data.bookId]: { ...data, "stock": 1 } });
            dispatch(setCartItems({ ...previousCart, [data.bookId]: { ...data, "stock": 1 } }))
        }
    }
    useEffect(() => {
        axios.get("/book/book_by_id/" + bookId).then((res) => {
            res.data.bookId = res.data.book_id;
            setBookData(res.data);
        }).catch((err) => {
            if (err.response && err.response.status == 404) {
                setBookData({ "found": false });
            }
            history.push("/");
        }).finally(() => {
            setIsLoading(false);
        })
        axios.get("/book/get_similar",{params:{id:bookId}}).then((res)=>{
            setSimilarBooks(res.data);
        }).catch((err)=>{
            setSimilarBooks([]);
        });
    }, [])
    return (
        <div className="view_page fs_full_book">
            {
                bookData.picture ?
                    <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                        <object data={bookData.picture} type="image/jpg" width="250px" onClick={handleToggle} className="fs_book_image fs_full_page">
                            <img src="https://fortuneshelfimages.s3.ap-south-1.amazonaws.com/media/books/default.png" width="250px" alt={bookData.tilte} onMouseEnter={handleToggle} className="fs_book_image fs_full_page" />
                        </object>
                    </Backdrop> : null
            }

            {
                !isLoading && !open ?
                    bookData.found && bookData.found == false
                        ? "Book Not found"
                        :
                        <>
                        <Container className="my-3 py-3">
                            <Row>
                                <SectionTitle title={bookData.title} />
                            </Row>
                            <Row className="align-items-center">
                                <Col className="text-center my-3 p-3">
                                    <object data={bookData.picture} type="image/jpg" width="250px" onMouseEnter={handleToggle} className="fs_book_image">
                                        <img src="https://fortuneshelfimages.s3.ap-south-1.amazonaws.com/media/books/default.png" width="250px" alt={bookData.tilte} onMouseEnter={handleToggle} className="fs_book_image" />
                                    </object>

                                </Col>
                                <Col className="align-items-center">
                                    <Table borderless striped hover>
                                        <tbody>
                                            <tr>
                                                <td>Title</td>
                                                <td>{bookData.title}</td>
                                            </tr>
                                            <tr>
                                                <td>Language</td>
                                                <td className="text-capitalize">{bookData.language}</td>
                                            </tr>
                                            <tr>
                                                <td>Price</td>
                                                <td>&#8377; {bookData.price}</td>
                                            </tr>
                                            <tr>
                                                <td>Weight</td>
                                                <td>{bookData.weight} Grams</td>
                                            </tr>
                                            <tr>
                                                <td>Dimension</td>
                                                <td>{bookData.dimension}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="2" className="text-center py-3">
                                                    {
                                                        props.cartItems && props.cartItems[bookId] && props.cartItems[bookId].stock > 0 ?
                                                            <ButtonGroup>
                                                                <Button variant="filled" color="primary" onClick={() => {
                                                                    if (props.cartItems[bookId].stock < props.cartItems[bookId].max_stock) {
                                                                        ChangeQuantity(props.cartItems[bookId].stock + 1, bookData.bookId || bookData.book_id);
                                                                    }
                                                                }
                                                                }>+</Button>
                                                                <h5 className="mx-1">{props.cartItems[bookId].stock}</h5>
                                                                <Button variant="filled" color="primary" disabled={(props.cartItems[bookId].stock) < 0} onClick={() => {
                                                                    if (props.cartItems[bookId].stock - 1 >= 0) {
                                                                        ChangeQuantity(props.cartItems[bookId].stock - 1, bookData.bookId || bookData.book_id);
                                                                    }
                                                                }}>-</Button>
                                                            </ButtonGroup>
                                                            :
                                                            <Button color="primary" variant="filled" onClick={() => { AddToCart(bookData) }}>Add <AddShoppingCartIcon fontSize="small" /></Button>

                                                    }

                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <SectionTitle title={"Description"}/>
                                <Col style={{ fontSize: "1.2rem",fontWeight:"500" }} className="px-3">
                                    {bookData.description}
                                </Col>
                            </Row>
                        </Container>
                        {similarBooks.length? <HorizontalSlider title={"Similar to this"} cartItems={props.cartItems}  books={similarBooks} />:null}
                        </>
                    : !open ? <ViewBookLoader /> : null
            }
        </div>
    )
}
function mapStateToProps(state) {
    const { cart } = state;
    return { cartItems: cart.cartItems }
}
export default connect(mapStateToProps)(ViewFullBook);