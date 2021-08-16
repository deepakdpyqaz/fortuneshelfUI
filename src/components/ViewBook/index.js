import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import "./view_book.scss";
import BookImage from "../../images/book.webp";
import { Button } from "../Utilities";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import NearMeIcon from '@material-ui/icons/NearMe';
const Book = () => {
    return (
        <>
            <Card style={{ width: '16rem' }} className="fs_book m-3">
                <Card.Body className="text-center">
                    <img src={BookImage} alt="" height="200" />
                    <Card.Text className="border-top border-secondary my-3 py-1">
                        <h5>Title of book</h5>
                        <h6>Hindi</h6>
                        <strong>&#8377; 5000</strong> <small><strike>6000</strike></small>
                    </Card.Text>
                    <ButtonGroup>
                        <Button color="primary" variant="filled">VIEW <NearMeIcon/> </Button>
                        <Button color="primary" variant="filled">ADD <AddShoppingCartIcon/></Button>
                    </ButtonGroup>
                </Card.Body>
            </Card>
        </>
    )
}

const BookContainer = () => {
    return (
        <Container className="fs_book_wrapper pb-3">
            <Row xs={1} md={2} className="g-0 justify-content-center">
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
                <Book />
            </Row>
        </Container>
    )
}
export { Book, BookContainer };