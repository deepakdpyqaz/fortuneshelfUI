import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "@material-ui/core/Input";
const Profile = () => {
    return (
        <Container>
            <form>
                <Row>
                    <Col>
                        <Input placeholder="Name.." fullWidth />
                    </Col>
                    <Col>
                        <Input placeholder="Mobile.." fullWidth />
                    </Col>
                </Row>
                <Row>
                <Col>
                <Input placeholder="Email.." type="email" fullWidth />
                </Col>
                <Col>
                    <Input placeholder="Email.."  fullWidth />
                </Col>
                </Row>
                <Input fullWidth
                    multiline
                    rows={4}
                    placeholder="Address"
                />
            </form>
        </Container>
    )
}
export default Profile;