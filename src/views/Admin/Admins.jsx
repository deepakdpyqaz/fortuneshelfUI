import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { Button } from "../../components/Utilities";
import { useAlert } from "react-alert";
import SectionTitle from "../../components/SectionTitle";
const Admin = () => {
    const history = useHistory();
    const admin = useSelector((state) => state.admin.adminDetails);
    const alert = useAlert();
    const [adminData, setAdminData] = useState([]);
    
    if (!(admin && admin.id)) {
        history.push("/admin/login")
    }

    useEffect(()=>{
        axios.get('/manager/all').then((res)=>{
            setAdminData(res.data);
        }).catch((err)=>{
            alert.error("Internal Server Error");
        })
    },[])
    return (
        <div>
            <Container className="my-3 px-3">
                <SectionTitle title="Admins"/>
                <Row className="my-3">
                    <Col md={12}>
                        <Link to="/admin/profile/0"><Button variant="filled" color="primary">Invite New</Button></Link>
                    </Col>
                </Row>
                <Table bordered bordered-dark striped hover responsive>
                    <thead>
                        <tr>
                            <th className="text-center">
                                Admin Id
                            </th>
                            <th className="text-center">
                                Email
                            </th>
                            <th className="text-center">
                                Phone
                            </th>
                            <th className="text-center">
                                Profile
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(adminData).map((elem) => {
                            return (
                                <tr key={elem.orderId}>
                                    <td className="text-center">
                                        {elem.id}
                                    </td>
                                    <td  className="text-center">
                                        {elem.email}
                                    </td>
                                    <td  className="text-center">
                                        {elem.mobile}
                                    </td>
                                    <td className="text-center">
                                        <Link to={"/admin/profile/" + elem.id}><Button variant="filled" color="primary" >Edit</Button></Link>
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

export default Admin;