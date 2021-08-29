import React,{ useEffect,useState } from "react";
import { useSelector } from "react-redux";
import {Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useAlert } from "react-alert";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import SectionTitle from "../../components/SectionTitle";
import { Button } from "../../components/Utilities";

const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
const renderDate = (date) =>{
    const dt = new Date(date);
    return `${days[dt.getDay()]} ${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}  ${dt.getHours()}:${dt.getMinutes()}`
}
const MyOrder = () => {
    const history = useHistory();
    const alert = useAlert();
    const userDetails = useSelector((state) => state.auth.userDetails);
    const [orderData,setOrderData] = useState([]);
    useEffect(() => {
        if (!(userDetails && userDetails.id)) {
            history.push("/");
        }
        axios.get("/order/get_orders").then((res) => {
            setOrderData(res.data);
        }).catch((err) => {

            if(err.response && err.response.status==401){
                history.push("/")
            }
            else{
                alert.error(err.message);
            }
        })

    }, [])
    return (
        <div className="view_page">
            <Container fluid className="my-3 px-3">
                <SectionTitle title="Order Summary" />
                <Table bordered bordered-dark striped hover responsive>
                    <thead>
                        <tr>
                            <th>
                                Serial Number
                            </th>
                            <th>
                                Order Id
                            </th>
                            <th>
                                Date
                            </th>
                            <th>
                                Track
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(orderData).map((elem, index) => {
                            return (
                                <tr key={elem.orderId}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {elem.orderId}
                                    </td>
                                    <td>
                                       <strong>{renderDate(elem.date)}</strong> 
                                    </td>
                                    <td>
                                        <Link to={"/trackorder?orderId="+elem.orderId}><Button color="primary" variant="filled">Track</Button></Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>


        </div>
    )
}

export default MyOrder;