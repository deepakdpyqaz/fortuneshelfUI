import React, { useState } from "react";
import { BookContainer } from "../../components/ViewBook";
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
import { ViewBookLoader } from "../../components/Loaders";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Slide from 'react-reveal/Slide';
import { useAlert } from "react-alert";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import { Button } from "../../components/Utilities";
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import Modal from "react-bootstrap/Modal"
const ViewBook = (props) => {
    const [books, setBooks] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const handelShowModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const [queryParams, setQueryParams] = useState(
        {
            "category": location.state && location.state.category ? location.state.category : "",
            "language": location.state && location.state.language ? location.state.language : "",
            "order_by": "",
            "isDescending": ""
        }
    );
    const alert = useAlert();
    const [loading, setLoading] = useState(false);
    const getBooks = (data, reset = false) => {
        if (loading) return;
        if (!pageNo || !data) return;
        setLoading(true);
        axios.get("/book", { params: { page_number: (reset ? 1 : pageNo), per_page: 25, ...data } }).then((res) => {
            if (res.data.length == 0) {
                setHasMore(false);
                return;
            }
            if (reset) {
                setBooks([res.data]);
            }
            else {
                setBooks((prevState) => {
                    return [...prevState, res.data]
                });
                if (res.data.length < 20) {
                    setHasMore(false);
                }
            }
        }).catch(err => {
            setHasMore(false);
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        }).finally(() => {
            setLoading(false);
            setPageNo((data)=>{return data+1});
        })
    }
    const handleSubmit = (e) => {
        setPageNo(1);
        getBooks(queryParams,true);
        setShowModal(false);
        setHasMore(true);
    }
    const handleChange = (e) => {
        setQueryParams((prevData) => {
            let newData = { ...prevData, [e.target.name]: e.target.value };
            return newData;
        });

    }
    return (
        <div className="viewbook view_page">
            <Modal show={showModal} backdrop={true} scrollable={true} onHide={handleCloseModal}>
                <Modal.Body closeButton>
                    <Modal.Title>Filter or Sort</Modal.Title>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Language" value={queryParams.language} onChange={handleChange} name="language">
                                <option value="">Language</option>
                                <option value="english">English</option>
                                <option value="bengali">Bengali</option>
                                <option value="marathi">Marathi</option>
                                <option value="hindi">Hindi</option>
                                <option value="urdu">Urdu</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Sort By" value={queryParams.order_by} onChange={handleChange} name="order_by">
                                <option value="">Sort By</option>
                                <option value="price">Price</option>
                                <option value="title">Name</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Sort Order" value={queryParams.isDescending} onChange={handleChange} name="isDescending">
                                <option value="">Sort Order</option>
                                <option value={false}>Ascending</option>
                                <option value={true}>Descending</option>
                            </Form.Select>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Form.Select aria-label="Category" value={queryParams.category} onChange={handleChange} name="category">
                                <option value="">Category</option>
                                <option value="gita">Gita</option>
                                <option value="set">Sets</option>
                                <option value="bhagavatam">Bhagavatam</option>
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
            <InfiniteScroll
                pageStart={pageNo}
                loadMore={() => { getBooks(queryParams) }}
                hasMore={hasMore}
                loader={<ViewBookLoader key={0} />}
            >
                {
                    books.map((elem, ind) => {
                        return (
                            <Slide left>
                                <BookContainer cartItems={props.cartItems} books={elem} key={ind} />
                            </Slide>
                        )
                    })
                }
            </InfiniteScroll>
        </div>
    )
}
function mapStateToProps(state) {
    const { cart } = state;
    return { cartItems: cart.cartItems }
}
export default connect(mapStateToProps)(ViewBook);