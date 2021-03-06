import React,{ useEffect,useState } from "react";
import { useSelector } from "react-redux";
import {Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useAlert } from "react-alert";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import SectionTitle from "../../components/SectionTitle";
import { Button } from "../../components/Utilities";

const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"]
const renderDate = (date) =>{
    const dt = new Date(date);
    return `${days[dt.getDay()]} ${(dt.getDate()).toString().padStart(2,'0')}-${(dt.getMonth()+1).toString().padStart(2,'0')}-${dt.getFullYear().toString()}  ${(dt.getHours()).toString().padStart(2,'0')}:${(dt.getMinutes()).toString().padStart(2,'0')}`
}
const MyOrder = () => {
    const history = useHistory();
    const location = useLocation();
    const alert = useAlert();
    const userDetails = useSelector((state) => state.auth.userDetails);
    const [orderData,setOrderData] = useState([]);
    useEffect(() => {
        if (!(userDetails && userDetails.id)) {
            history.push({pathname:"/",state:{"pathname":location.pathname}});
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
            <Container  className="my-3 px-3" style={{"maxWidth":"800px"}}>
                <SectionTitle title="Order Summary" />
                <Table bordered bordered-dark striped hover responsive size="sm">
                    <thead>
                        <tr>
                            <th className="text-center">
                                Serial
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
                                    <td className="text-center">
                                        {index + 1}
                                    </td>
                                    <td>
                                        {elem.orderId}
                                    </td>
                                    <td>
                                       {renderDate(elem.date)}
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