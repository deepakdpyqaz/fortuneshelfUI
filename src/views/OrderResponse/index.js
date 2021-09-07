import { useLocation, Link } from "react-router-dom";
import { useState,useEffect } from "react";
import Container from "react-bootstrap/Container";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {Button} from "../../components/Utilities";
import image from "../../images/logo.png";
import { useAlert } from "react-alert";
import { reactLocalStorage } from 'reactjs-localstorage';
import { setCartItems } from "../../reducers/cart";
import { useDispatch} from "react-redux";
import axios from "axios";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
const Waiting = ()=> {
  const classes = useStyles();

  return (
    <div>
     <Backdrop className={classes.backdrop} open={true} >
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
}
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Success = (props) => {
    const [copied, setCopied] = useState(false);
    return (
        <div className="view_page">
            <Container className="my-3 py-3 justify-content-center text-center">
                <img src={image} alt="" />
                <br/>
                <h2 id="transition-modal-title" className="text-center text-success">Your Order is placed Succesfully</h2>
                <h3 className="text-center">Your order Id is:</h3>
                <h3 id="transition-modal-description" className="text-center">{props.orderId}</h3>
                <div className="text-center">
                    <CopyToClipboard text={props.orderId}
                        onCopy={() => setCopied(true)}>
                        <Button variant="filled" color="primary">{copied ? "Copied" : "Copy"}</Button>
                    </CopyToClipboard>
                </div>
                <h3 className="text-center"><Link to="/"><Button color="primary" variant="filled">Home</Button></Link></h3>
            </Container>
        </div>
    )
}
const Fail = (props) => {
    return (
            <Container className="my-3 py-3 justify-content-center text-center">
                <img src={image} alt="" />
                {   props.status=="fail"?
                    <h2 id="transition-modal-title" className="text-center text-danger">Transaction not successfull!!!</h2>
                    :<h2 id="transition-modal-title" className="text-center text-danger">Record not found</h2>
                }
                <h6 className="text-center"> Please try again. For enquiry contact us at <a href="mailTo:enquiry@fortuneshelf.com" className="link">enquiry@fortuneshelf.com</a> </h6>
                <h3 className="text-center"><Link to="/"><Button color="primary" variant="filled">Home</Button></Link></h3>
            </Container>
    )
}
const OrderResponse = () => {
    const query = useQuery();
    const [status, setStatus] = useState("");
    const orderId = query.get("orderId");
    const alert = useAlert();
    const dispatch = useDispatch();
    useEffect(()=>{
        axios.get("/payment/"+orderId).then((res)=>{
            setStatus(res.data.payment_status);
            reactLocalStorage.setObject("cart", {});
            dispatch(setCartItems({}));
        }).catch((err)=>{
            if(err.response && err.response.data){
                setStatus("not found");
            }
            else{
                alert("Some error occured!!");
            }
        })
    })
    return (
        <div className="view_page">
            {status == '' ? <Waiting /> : (status=='success'?<Success orderId={orderId} />:<Fail status={status}/>)}
        </div>
    )
}

export default OrderResponse;