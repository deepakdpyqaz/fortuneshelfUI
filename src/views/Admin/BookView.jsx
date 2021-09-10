import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Input from "@material-ui/core/Input";
import Label from "@material-ui/core/FormLabel";
import { useParams } from "react-router";
import { useAlert } from "react-alert";
import SectionTitle from "../../components/SectionTitle";
import { Button } from "../../components/Utilities";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useHistory } from "react-router-dom";
const BookView = () => {
    const params = useParams();
    const bookId = params["bookId"];
    const [data, setData] = useState({});
    const imageRef = useRef();
    const alert = useAlert();
    const history = useHistory();
    const changeImage = (e) => {
        e.preventDefault();
        imageRef.current.click();
    }
    const handleChange = (e) => {
        setData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value }
        })
    }
    const handleImageChange = (e) => {
        setData((prevData) => {
            return { ...prevData, [e.target.name]: URL.createObjectURL(e.target.files[0]) }
        })
    }
    const handleDeliveryChange = (e) => {
        setData((prevData) => {
            return {
                ...prevData,
                "delivery_factor": prevData.delivery_factor == 1 ? 0 : 1
            }
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("picture", imageRef.current.files[0]);
        for (let item in data) {
            if (item != "picture") {
                formData.append(item, data[item]);
            }
        }
        if(bookId!=0){

            axios.post("/book/" + bookId, formData).then((res) => {
                alert.success("Updated Succesfully");
            }).catch((err) => {
                if (err.response && err.response.data) {
                    alert.error(err.response.data.message);
                }
                else {
                    alert.error("Error in updating book")
                }
            })
        }
        else{
            axios.put("/book/add",formData).then((res)=>{
                alert.success("Book Added Successfully");
                history.push("/admin/books/"+res.data.bookId);
            }).catch((err)=>{
                if (err.response && err.response.data) {
                    alert.error(err.response.data.message);
                }
                else {
                    alert.error("Error in updating book")
                }
            })
        }
    }
    useEffect(() => {
        if (bookId != 0) {
            axios.get("/book/book_by_id/" + bookId).then((res) => {
                if (res.data.picture) {
                    res.data.picture = axios.defaults.baseURL + res.data.picture;
                }
                setData(res.data);
            }).catch((err) => {
                if (err.response && err.response.data) {
                    alert.error(err.response.data.message);
                }
                else {
                    alert.error("Internal Server Error");
                }
            })
        }
    }, [])
    return (
        <Container style={{ "maxWidth": "800px" }} className="py-3">
            <SectionTitle title={bookId!=0?data.title:"Add New Book"} />
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Label>Title</Label>
                        <Input fullWidth value={data.title} name="title" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Price</Label>
                        <Input fullWidth value={data.price} name="price" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Language</Label>
                        <Input fullWidth value={data.language} name="language" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Discount</Label>
                        <Input fullWidth value={data.discount} name="discount" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Length</Label>
                        <Input fullWidth value={data.length} name="length" type="number" onChange={handleChange} />
                    </Col>
                    <Col>
                        <Label>Breadth</Label>
                        <Input fullWidth value={data.breadth} name="breadth" type="number" onChange={handleChange} />
                    </Col>
                    <Col>
                        <Label>Height</Label>
                        <Input fullWidth value={data.height} name="height" type="number" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Weight</Label>
                        <Input fullWidth value={data.weight} name="weight" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Description</Label>
                        <Input fullWidth value={data.description} name="description" multiline rows={4} onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Stock</Label>
                        <Input fullWidth value={data.max_stock} name="max_stock" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Label>Category</Label>
                        <Input fullWidth value={data.category != null ? data.category : ""} name="category" onChange={handleChange} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <FormControlLabel
                            control={<Checkbox checked={data.delivery_factor == 1} value={data.delivery_factor} onChange={handleDeliveryChange} name="delivery_charges" />}
                            label="Delivery Charges"
                            color="primary"
                        />
                    </Col>
                </Row>
                <br />
                <br />
                <Row>
                    <Col>
                        <Label>Book Image &nbsp;<Button variant="filled" color="primary" onClick={changeImage}>Change</Button></Label>
                        <input hidden ref={imageRef} type="file" name="picture" accept="image/*" onChange={handleImageChange} />
                    </Col>
                    <Col>
                        <img src={data.picture} width="200px" alt="No image uploaded" />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Button color="primary" variant="filled">Save</Button>
                    </Col>
                </Row>
            </form>
        </Container>
    )
}
export default BookView;