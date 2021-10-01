import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import SearchIcon from "@material-ui/icons/Search";
import Table from "react-bootstrap/Table";
import Input from "@material-ui/core/Input";
import { Link } from "react-router-dom";
import { Button } from "../../components/Utilities";
import { useAlert } from "react-alert";
import {ApiLoader} from "../../components/Loaders";
import Modal from "react-bootstrap/Modal";
const Book = () => {
    const history = useHistory();
    const location = useLocation();
    const [isLoading,setIsLoading] = useState(false);
    const admin = useSelector((state) => state.admin.adminDetails);
    const alert = useAlert();
    const [searchQuery, setSearchQuery] = useState("");
    const [bookData, setBookData] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [show, setShow] = useState(false);
    const [deliveryCharges,setDeliveryCharges]=useState();
    const handleDeliveryChargeChange = (e)=>{
        setDeliveryCharges(e.target.value);
    }
    const handleDeliveryChargeSubmit = ()=>{
        setIsLoading(true);
        axios.post("/set_delivery_charges",{"delivery_charges":deliveryCharges}).then(()=>{
            alert.success("Updated Succesfully");
        }).catch((err)=>{
            alert.error(err.message);
        }).finally(()=>{
            setIsLoading(false);
            handleClose();
        })
    }
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setBookData(() => {
            return allBooks.filter((book) => {
                return ((book.bookId + "").toLowerCase()).includes((e.target.value).toLowerCase()) || (book.title.toLowerCase()).includes(e.target.value.toLowerCase())
            });
        })
    }
    if (!(admin && admin.id)) {
        history.push({ pathname: "/admin/login", state: { pathname: location.pathname } });
    }

    useEffect(() => {
        if (admin.id && admin.id) {
            setIsLoading(true);
            axios.get("/book/all").then((res) => {
                setAllBooks(res.data.data);
                setBookData(res.data.data);
            }).catch((err) => {
                if(err.response && err.response.status==401){
                    history.push({ pathname: "/admin/login", state: { pathname: location.pathname } });
                }
                alert.error("Internal Server Error");
            }).finally(()=>{
                setIsLoading(false);
            })
            axios.get("/delivery_charges").then((res)=>{
                setDeliveryCharges(res.data.delivery_charges)
            })
        }
        
    }, [])
    return (
        <div>
            <ApiLoader loading={isLoading}/>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Delivery Charges</Modal.Title>
                </Modal.Header>
                <Modal.Body><Form.Control type="number" placeholder="Delivery Charges" value={deliveryCharges} onChange={handleDeliveryChargeChange} /></Modal.Body>
                <Modal.Footer className="justify-content-around">
                    <Button variant="filled" color="primary" className="mx-2" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="filled" color="primary" className="mx-2" onClick={handleDeliveryChargeSubmit}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container className="my-3 px-3">
                <Row className="justify-content-center">
                    <Col md={4} className="mx-2">

                        <Link to="/admin/books/0"><Row><Button variant="filled" color="primary">Add a new book</Button></Row></Link>
                    </Col>
                    <Col md={4} className="mx-2">

                        <Row><Button variant="filled" color="primary" onClick={handleShow}>Update Delivery Charge</Button></Row>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col className="fs_search justify-content-stretch" className="my-2">
                        <Row className="align-items-center gx-1">
                            <Col>
                                <Form.Control type="text" placeholder="Search book by book id or title" value={searchQuery} onChange={handleSearchQueryChange} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Container className="my-3 px-3">
                <Table bordered bordered-dark striped hover responsive>
                    <thead>
                        <tr>
                            <th className="text-center">
                                Book Id
                            </th>
                            <th className="text-center">
                                Title
                            </th>
                            <th className="text-center">
                                View
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(bookData).map((elem) => {
                            return (
                                <tr key={elem.bookId}>
                                    <td className="text-center">
                                        {elem.bookId}
                                    </td>
                                    <td>
                                        {elem.title}
                                    </td>
                                    <td className="text-center">
                                        <Link to={"/admin/books/" + elem.bookId}><Button variant="filled" color="primary" >View</Button></Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>

        </div>
    )
}

export default Book;