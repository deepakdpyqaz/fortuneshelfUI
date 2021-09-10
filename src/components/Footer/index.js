import "./footer.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import EmailIcon from '@material-ui/icons/Email';
import CallIcon from '@material-ui/icons/Call';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import image from "../../images/logo.png";
const Footer = () => {
    const footer = useRef();

    return (
        <div ref={footer} className="fs_footer">
            <Container fluid>
                <Row>
                    <Col className="fs_footer_cols" sm="4">
                        <h3>Contact us</h3>
                        <li><EmailIcon/> <a href="mailTo:enquiry@fortuneshelf.com" target="_blank">enquiry@fortuneshelf.com</a> </li>
                        <li><CallIcon/> <a href="tel:6369292605" target="_blank">6369292605</a> </li>
                        <li><WhatsAppIcon/> <a href="https://wa.me/message/AU64PKJXJA2UP1" target="_blank">Whatsapp Group</a> </li>
                    </Col>
                    <Col className="fs_footer_cols">
                        <h3>Our Policies</h3>
                        <Link to="/about/privacy_policy"><li>Privacy Policies</li></Link>
                        <Link to="/about/terms_and_conditions"><li>Terms and Conditions</li></Link>
                        <Link to="/about/shipping_policy"><li>Shipping Policy</li></Link>
                        <Link to="/about/cancellation_policy"><li>Cancellation and Refund Policy</li></Link>
                    </Col>
                    <Col className="fs_footer_cols justify-content-end text-right" sm="3">
                       <Link to="/"><img src={image} height="200"/></Link>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;