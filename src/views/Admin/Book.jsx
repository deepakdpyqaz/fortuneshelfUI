import React,{ useRef, useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
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
import {Link} from "react-router-dom";
import {Button} from "../../components/Utilities";
import { useAlert } from "react-alert";

const Book = () => {
    const history = useHistory();
    const admin = useSelector((state) => state.admin.adminDetails);
    const alert = useAlert();
    const [searchQuery, setSearchQuery] = useState("");
    const [bookData,setBookData]=useState([]);
    const [allBooks,setAllBooks] = useState([]);
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setBookData(()=>{
            return  allBooks.filter((book)=>{
                return ((book.bookId+"").toLowerCase()).includes((e.target.value).toLowerCase())||(book.title.toLowerCase()).includes(e.target.value.toLowerCase())
            });
        })
    }
    if (!(admin && admin.id)) {
        history.push("/admin/login")
    }
    // const [searchData,setSearchData] = useState({
    //     "type":"",
    //     "isDescending":"",
    // })
    // const handleChange = (e) => {
    //     setSearchData((prevData)=>{
    //         return {...prevData,[e.target.name]:e.target.value}
    //     })
    // };
    useEffect(()=>{
        axios.get("/book/all").then((res)=>{
            setAllBooks(res.data.data);
            setBookData(res.data.data);
        }).catch((err)=>{
            alert.error("Internal Server Error");
        })
    },[])
    return (
        <div>
            <Container className="my-3 px-3">
                <Row>
                    {/* <Col className="my-2">
                        <Form.Select aria-label="Search By:" onChange={handleChange} name="type">
                            <option value="">Search By</option>
                            <option value="bookId">Book Id</option>
                            <option value="title">Title</option>
                            <option value="keyword">Keyword</option>
                        </Form.Select>
                    </Col>
                    
                        {
                            searchData.type=="title"?
                    <Col md={4} sm={6} xs={12} className="my-2">
                            <Form.Select aria-label="Sort Order" onChange={handleChange} name="isDescending">
                                <option value="">Sort Order</option>
                                <option value={false}>Ascending</option>
                                <option value={true}>Descending</option>
                            </Form.Select>
                    </Col>
                            :null
                        } */}
                    <Col className="fs_search justify-content-stretch" className="my-2">
                        <Row className="align-items-center gx-1">
                            <Col>
                                <Form.Control type="text" placeholder="Enter book id or title" value={searchQuery} onChange={handleSearchQueryChange} />
                            </Col>
                            {/* <Col md={1} xs={1} sm={1} lg={1} className="align-items-center justify-content-start">
                                <SearchIcon ref={target} className="fs_search_btn" onClick={makeSearch} />
                                <Overlay target={target.current} show={showSearchTip} placement="bottom">
                                    {(props) => (
                                        <Tooltip id="overlay-example" {...props}>
                                            Type atleast four words
                                        </Tooltip>
                                    )}
                                </Overlay>
                            </Col> */}
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                            <Link to="/admin/books/0"><Button variant="filled" color="primary">Add</Button></Link>
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
                                        <Link to={"/admin/books/"+elem.bookId}><Button variant="filled" color="primary" >View</Button></Link>
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