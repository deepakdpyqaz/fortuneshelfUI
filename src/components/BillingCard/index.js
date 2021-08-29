import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./billingcard.scss";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Button } from "../Utilities";
const BillingCard = (props) => {
    return (
        <Row className="fs_billing_card justify-content-center">
            <div className="fs_billing_remove">
            <Button color="primary" variant="filled" onClick={()=>{props.deleteBillingProfile(props.id)}}><DeleteForeverIcon/></Button>
            </div>
            <Col>
                <h4>{props.index}) {props.title}</h4>
                <p>{props.address}</p>
                <h5>{props.district} {props.city} {props.pincode} {props.state}</h5>
            </Col>
        </Row>

    )
}
export default BillingCard;