import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
import Label from "@material-ui/core/FormLabel";
import Form from "react-bootstrap/Form";
import { Button } from "../../components/Utilities";
import axios from "axios";
import SectionTitle from "../../components/SectionTitle";
import Container from "react-bootstrap/Container";
import { useAlert } from "react-alert";
import { ApiLoader } from "../../components/Loaders";
const Contact = () => {
    const [data, setData] = useState({});
    const alert = useAlert();
    const [isLoading,setIsLoading] = useState(false);
    const handleChange = (e) => {
        setData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        axios.post("/user/message",data).then((res)=>{
            alert.success("We have received your message!!");
            setData({"first_name":"","last_name":"","email":"","phone":"","message":""});
        }).catch((err)=>{
            alert.error("Eror in sending message");
        }).finally(()=>{
            setIsLoading(false);
        })
    }
    return (
        <Container clasName="my-3">
            <ApiLoader loading={isLoading} />
            <SectionTitle title="Contact Us" />
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col md="6" className="my-3">
                        <Label>First Name</Label>
                        <Input required value={data.first_name} onChange={handleChange} name="first_name" fullWidth placeholder="First Name" />
                    </Col>
                    <Col md="6" className="my-3">
                        <Label>Last Name</Label>
                        <Input required value={data.last_name} onChange={handleChange} name="last_name" fullWidth placeholder="Last Name" />
                    </Col>
                </Row>
                <Row>
                    <Col md="6" className="my-3">
                        <Label>Email</Label>
                        <Input required value={data.email} onChange={handleChange} name="email" fullWidth placeholder="Email" />
                    </Col>
                    <Col md="6" className="my-3">
                        <Label>Phone</Label>
                        <Input required value={data.phone} onChange={handleChange} name="phone" fullWidth placeholder="Phone" />
                    </Col>
                </Row>
                <Row>
                    <Col md="12" className="my-3">
                        <Label>Message</Label>
                        <Input fullWidth
                            multiline
                            rows={4}
                            placeholder="Message/Query"
                            required
                            name="message"
                            value={data.message}
                            onChange={handleChange}
                        />
                    </Col>
                </Row>
                <Row className="mt-3 mb-3">
                    <Col className="justify-content-center text-center">
                        <Button color="primary" variant="filled">Submit</Button>
                    </Col>
                </Row>
            </form>
        </Container>
    )
}

export default Contact;