import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./billingcard.scss";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import { Button } from "../Utilities";

const BillingCard = (props) => {
    return (
        <Col className="fs_billing_card" md={5}>
            <div className="fs_billing_remove">
            <Button color="secondary" variant="filled" onClick={()=>{props.deleteBillingProfile(props.id)}}><DeleteForeverIcon/></Button>
            {" "}
            <Button color="primary" variant="filled" onClick={()=>{props.editBillingProfile(props.id)}}><EditIcon/></Button>
            </div>
            <Col onClick={()=>{props.editBillingProfile(props.id)}}>
                <h4>{props.index}) {props.title}</h4>
                <p>{props.address}</p>
                <h6>{props.district}, {props.city}-{props.pincode}, {props.state}</h6>
            </Col>
        </Col>

    )
}
export default BillingCard;