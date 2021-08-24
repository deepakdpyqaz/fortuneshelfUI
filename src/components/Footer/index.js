import "./footer.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from "react-router-dom";
const Footer = () =>{
    return (
        <div className="fs_footer">
            <Container fluid>
                <Row>
                    <Col className="fs_footer_cols" sm="3" xs="6">
                        <h3>Our Policies</h3>
                        <Link to="/about/privacy_policy"><li>Privacy Policies</li></Link>
                        <Link to="/about/terms_and_conditions"><li>Terms and Conditions</li></Link>
                        <Link to="/about/shipping_policy"><li>Shipping Policy</li></Link>
                        <Link to="/about/cancellation_policy"><li>Cancellation and Refund Policy</li></Link>
                    </Col>
                    <Col className="fs_footer_cols" sm="3" xs="6">
                        <h3>Contact us</h3>
                        <li>mail us at <a href="mailTo:enquiry@fortuneshelf.com">enquiry@fortuneshelf.com</a> </li>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;