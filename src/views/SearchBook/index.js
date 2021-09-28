import React, { useState, useEffect } from "react";
import { BookContainer } from "../../components/ViewBook";
import axios from "axios";
import { connect,useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { ViewBookLoader, viewBookLoader } from "../../components/Loaders";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "../../components/Utilities";
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import Modal from "react-bootstrap/Modal";
import { useAlert } from "react-alert";
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchBook = (props) => {
    const params = useParams();
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const query = useQuery();
    const [filteredBooks,setFilteredBooks] = useState([]);
    const languages = useSelector((state)=>state.filter.languages);
    const categories = useSelector((state)=>state.filter.categories);
    const alert = useAlert();
    const handelShowModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const [showModal, setShowModal] = useState(false);
    const [queryParams, setQueryParams] = useState(
        {
            "category": "",
            "language": "",
            "order_by": "",
            "isDescending": 1
        }
    );
    useEffect(() => {
        setIsLoading(true);
        axios.get("/book/search", { params: { "query": query.get("searchQuery") } }).then((res) => {
            setBooks(res.data);
            setFilteredBooks(res.data);
        }).catch((err) => {
            alert.error(err.message);
        }).finally(() => {
            setIsLoading(false);
        })
    }, [location.search]);
    const handleSubmit = (e) => {
        e.preventDefault();
        let data = books.filter((elem)=>{
            if(queryParams.category){
                if(elem.category!=queryParams.category) return false;
            }
            if(queryParams.language){
                if(elem.language!=queryParams.language) return false;
            }
            return true;
        })
        data.sort((a,b)=>{
            if(queryParams.order_by){
                if(isNaN(Number(a[queryParams.order_by]))){
                    let sol=0;
                    if(a[queryParams.order_by].toLowerCase() > b[queryParams.order_by].toLowerCase()){
                        sol=1;
                    }
                    else{
                        sol=-1;
                    }
                    return sol*queryParams.isDescending;
                }else{
                    console.log("nbr");
                    return (Number(a[queryParams.order_by])-Number(b[queryParams.order_by]))*queryParams.isDescending;
                }
            }
        })
        setFilteredBooks(data);
    }
    const handleChange = (e) => {
        setQueryParams((prevData) => {
            let newData = { ...prevData, [e.target.name]: e.target.value };
            return newData;
        });

    }

    return (
        <div className="searchBook view_page" >
            <Modal show={showModal} backdrop={true} scrollable={true} onHide={handleCloseModal}>
                <Modal.Body closeButton>
                    <Modal.Title>Filter or Sort</Modal.Title>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Language" value={queryParams.language} className="text-capitalize" onChange={handleChange} name="language">
                                <option value="">All Languages</option>
                                {
                                    languages ? languages.map((item) => {
                                        return <option key={item} value={item} className={"text-capitalize"}>{item}</option>
                                    }) : null
                                }

                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Sort By" value={queryParams.order_by} onChange={handleChange} name="order_by">
                                <option value="">No Sorting</option>
                                <option value="price">Price</option>
                                <option value="title">Name</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Sort Order" value={queryParams.isDescending} onChange={handleChange} name="isDescending">
                                <option value={1}>Ascending</option>
                                <option value={-1}>Descending</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Category" value={queryParams.category} onChange={handleChange} className="text-capitalize" name="category">
                                <option value="">All Categories</option>
                                {
                                    categories?categories.map((item)=>{
                                        return <option key={item} value={item} className={"text-capitalize"}>{item}</option>
                                    }):null
                                }
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Button color="primary" variant="filled" onClick={handleSubmit}>
                                Apply
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
            <Container fluid className="my-3">
                <Row className="justify-content-end">
                    <Col md={4} className="justify-content-end text-center">
                        <Button color="primary" variant="filled" onClick={handelShowModal}><h6 className="m-1 py-0">
                            <FilterListIcon /> Filter or Sort <SortIcon />
                        </h6></Button>
                    </Col>
                </Row>
            </Container>
            <h3 className="text-center my-3">Search results for <em>"{query.get("searchQuery")}"</em></h3>
            {(!isLoading ?
                (
                    books.length != 0 ?
                        <BookContainer cartItems={props.cartItems} books={filteredBooks} />
                        : <h3 className="my-3 text-center">No Books found</h3>
                ) :
                <ViewBookLoader />
            )}
        </div>
    )
}
function mapStateToProps(state) {
    const { cart } = state;
    return { cartItems: cart.cartItems }
}
export default connect(mapStateToProps)(SearchBook);