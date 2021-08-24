import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
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
import { useSelector,useDispatch } from "react-redux";
import { setCartItems } from "../../reducers/cart";
const ViewFullBook = (props) => {
    const { bookId } = useParams();
    const [bookData, setBookData] = useState("");
    const [isLoading, setIsLoading] = useState(true);
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
    useEffect(() => {
        axios.get("/book/book_by_id/" + bookId).then((res) => {
            setBookData(res.data);
        }).catch((err) => {
            if (err.response && err.response.status == 404) {
                setBookData({ "found": false });
            }
        }).finally(() => {
            setIsLoading(false);
        })
    }, [])
    return (
        <div style={{ paddingTop: "10vh" }}>
            {
                !isLoading ?
                    bookData.found && bookData.found == false
                        ? "Book Not found"
                        :
                        <Container className="my-3 py-3">
                            <Row>
                                <SectionTitle title={bookData.title}/>
                            </Row>
                            <Row>
                                <Col>
                                    <img src={axios.defaults.baseURL + bookData.picture} alt={bookData.title} />
                                </Col>
                                <Col>
                                    <Table borderless striped hover>
                                        <tbody>
                                            <tr>
                                                <td>Title</td>
                                                <td>{bookData.title}</td>
                                            </tr>
                                            <tr>
                                                <td>Language</td>
                                                <td>{bookData.language}</td>
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
                                                <td colSpan="2">
                                                    <Button color="primary" variant="filled" onClick={() => { AddToCart(bookData) }}>ADD <AddShoppingCartIcon /></Button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <h2 className="text-center text-decoration-underline my-3" style={{color:"#031F30"}}>Description</h2>
                                <Col style={{fontSize:"1.2rem"}} className="px-3">
                                    {bookData.description}
                                </Col>
                            </Row>
                        </Container>
                    : <ViewBookLoader />
            }
        </div>
    )
}

export default ViewFullBook;