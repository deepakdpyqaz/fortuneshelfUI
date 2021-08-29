import SectionTitle from "../../components/SectionTitle";
import { useLocation, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Input from "@material-ui/core/Input";
import axios from "axios";
import { useAlert } from "react-alert";
import { Button } from "../../components/Utilities";
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import SyncIcon from '@material-ui/icons/Sync';
import LayersIcon from '@material-ui/icons/Layers';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "react-bootstrap/Table";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: '6px 16px',
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

function OrderTimeline(props) {
  const classes = useStyles();
  const status = ["pending", "packed", "shipped", "deliverd"]
  const colors = ["", "", "", ""];
  for (let i = 0; i < status.length; i++) {
    if (status[i] == props.status) {
      colors[i] = "secondary";
      break;
    }
    colors[i] = "primary";
  }
  return (
    <Timeline align="alternate">
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={colors[0]}>
            <SyncIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
              Preparing
            </Typography>
            <Typography>We are preparing your order</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>

        <TimelineSeparator>
          <TimelineDot color={colors[1]}>
            <LayersIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
              Packed
            </Typography>
            <Typography>Your order is packed and ready for delivery!!</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={colors[2]}>
            <LocalShippingIcon />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
              Shipped
            </Typography>
            <Typography>Your order is shipped. It will arrive soon</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={colors[3]}>
            <AssignmentTurnedInIcon />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h6" component="h1">
              Delivered
            </Typography>
            <Typography>Orders is successfully delivered</Typography>
          </Paper>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

const TrackOrder = () => {
  const query = useQuery();
  const alert = useAlert();
  const location = useLocation();
  const history = useHistory();
  const [orderId, setOrderId] = useState("");
  const [loader, setLoader] = useState(0);
  const [orderData,setOrderData] = useState({});
  const [amount,setAmount] = useState({});
  const [deliveryCharges,setDeliveryCharges] = useState({});
  const handleChange = (e) => {
    setOrderId(e.target.value);
  }
  const [orderStatus, setOrderStatus] = useState("");
  const callTrackOrderApi = (order_id) => {
    setOrderStatus("");
    setLoader(1);
    if (!order_id) return;
    axios.get("/order/track_order", { params: { orderId: order_id } }).then((res) => {
      setOrderStatus(res.data.status);
      setOrderData(res.data.details);
      setAmount(res.data.amount);
      setDeliveryCharges(res.data.delivery_charges);
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.message) {
        alert.error(err.response.data.message)
      }
      else {
        alert.error(err.message);
      }
    }).finally(() => {
      setLoader(0);
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(Number(orderId))) {
      alert.error("Order Id must be a number");
      return;
    }
    else if (orderId < 100000) {
      alert.error("Atleast 6 digits required");
      return;
    }
    history.push("/trackorder?orderId=" + orderId);
  }
  useEffect(() => {
    if (query.has("orderId")) {
      let order_id = query.get("orderId");
      if (order_id) {
        setOrderId(order_id);
        callTrackOrderApi(order_id);
      }
    }
  }, [location.search])
  return (
    <div className="track_order view_page">
      <SectionTitle title="Track Your Order" />
      <Container style={{ "maxWidth": "600px" }} className="justify-content-center text-center">
        <form onSubmit={handleSubmit}>
          <Input fullWidth placeholder="Order Id" name="orderId" value={orderId} onChange={handleChange} />
          <br />
          <br />

          <Button variant="filled" disabled={!orderId || isNaN(orderId) || Number(orderId) < 100000} color="primary" type="submit">Track</Button>
        </form>
      </Container>
      {
        loader == 1 ?
          <Container className="justify-content-center text-center my-3 py-3">
            <CircularProgress color="primary" />
          </Container> : null
      }
      {
        orderStatus && loader != 1 ?
          <>
            <Container className="my-3 px-3">
              <SectionTitle title="Order Details" />
              <Table bordered bordered-dark striped hover responsive>
                <thead>
                  <tr>
                    <th>
                      Serial Number
                    </th>
                    <th>
                      Title
                    </th>
                    <th>
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.map((elem, index) => {
                    return (
                      <tr key={elem.bookId}>
                        <td>
                          {index + 1}
                        </td>
                        <td>
                          {elem.title}
                        </td>
                        <td>
                          {elem.qty}
                        </td>
                      </tr>
                    )
                  })}
                  <br />
                  <tr>
                    <td>Price</td>
                    <td colSpan="5">&#8377; {amount} /-</td>
                  </tr>
                  <tr>
                    <td>Delivery Charges</td>
                    <td colSpan="5">&#8377; {deliveryCharges} /-</td>
                  </tr>
                  <tr>
                    <td>Total Amount</td>
                    <td colSpan="5">&#8377; {deliveryCharges + amount} /-</td>
                  </tr>
                </tbody>
              </Table>
            </Container>


            <Container className="justify-content-center">

              <OrderTimeline status={orderStatus} />
            </Container>
          </>
          : null
      }
    </div>
  )
}

export default TrackOrder;