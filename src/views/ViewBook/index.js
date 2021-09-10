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
const ViewBook = () => {
    const [books, setBooks] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [queryParams,setQueryParams] = useState({});
    const alert = useAlert();
    const getBooks = (data) => {
        if(!pageNo || !data) return;
        axios.get("/book", { params: { page_number: pageNo, per_page: 25,...data } }).then((res) => {
            if (res.data.length == 0) {
                setHasMore(false);
                return;
            }
            setBooks((prevState) => {
                return [...prevState, res.data]
            });
        }).catch(err => {
            setHasMore(false);
            if (err.response && err.response.data && err.response.data.message) {
                alert.error(err.response.data.message);
            }
            else {
                alert.error(err.message);
            }
        }).finally(() => {
            setPageNo(pageNo + 1);
        })
    }
    const handleChange=(e)=>{
        setQueryParams((prevData)=>{
            let newData = {...prevData,[e.target.name]:e.target.value};
            getBooks(newData);
            return newData;
        });
        setBooks([]);
        setPageNo(1);
        setHasMore(true);

    }
    return (
        <div className="viewbook view_page">
            <Container fluid className="my-3">
                <Row>
                    <Col>
                        <Form.Select aria-label="Language" onChange={handleChange} name="language">
                            <option value="">Language</option>
                            <option value="english">English</option>
                            <option value="bengali">Bengali</option>
                            <option value="marathi">Marathi</option>
                            <option value="hindi">Hindi</option>
                            <option value="urdu">Urdu</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Select aria-label="Sort By" onChange={handleChange} name="order_by">
                            <option value="">Sort By</option>
                            <option value="price">Price</option>
                            <option value="title">Name</option>
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Select aria-label="Sort Order" onChange={handleChange} name="isDescending">
                            <option value="">Sort Order</option>
                            <option value={false}>Ascending</option>
                            <option value={true}>Descending</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Container>
            <InfiniteScroll
                pageStart={pageNo}
                loadMore={getBooks}
                hasMore={hasMore}
                loader={<ViewBookLoader key={0} />}
            >
                {
                    books.map((elem, ind) => {
                        return (
                            <Slide left>
                                <BookContainer books={elem} key={ind} />
                            </Slide>
                        )
                    })
                }
            </InfiniteScroll>
        </div>
    )
}

export default ViewBook;