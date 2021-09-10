import React,{useState,useEffect} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { Button } from "../../components/Utilities";
import ResendOtp from "../../components/ResendOtp";
import Input from "@material-ui/core/Input";
import SectionTitle from "../../components/SectionTitle";
import { useAlert } from "react-alert";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../reducers/admin';
import { reactLocalStorage } from 'reactjs-localstorage';
const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));
  
const ResetPassword = () => {
    const [verified,setVerified] = useState("");
    const alert = useAlert();
    const dispatch = useDispatch();
    const [resetDetails,setResetDetails] = useState({});
    const history = useHistory();
    const [openBackdrop,setOpenBackdrop] = useState(false);
    const handleChange = (e) => {
        setResetDetails((prevData)=>{
            return {...prevData,[e.target.name]:e.target.value}
        })
    }
    const classes = useStyles();

    const handleSubmit = (e) => {
        e.preventDefault();
        setOpenBackdrop(true);
        if(!verified){
            axios.post("/manager/reset_password_request",{username:resetDetails.username}).then((res)=>{
                setVerified(true);
                setResetDetails((prevData)=>{
                    return {...prevData,"managerId":res.data.managerId,"isVerified":true}
                })
            }).catch((err)=>{
                if(err.response && err.response.data){
                    alert.error(err.response.data.message)
                }
                else{
                    alert.error(err.message);
                }
            }).finally((err)=>{
                setOpenBackdrop(false);
            })
        }
        else{
            axios.post("/manager/reset_password",resetDetails).then((res)=>{
                alert.success("Password Reset Succesfull")
                history.push("/admin/login");
            }).catch((err)=>{
                if(err.response && err.response.data){
                    alert.error(err.response.data.message)
                }
                else{
                    alert.error(err.message);
                }
            }).finally((err)=>{
                setOpenBackdrop(false);
            })
        }
    }
    useEffect(()=>{
        reactLocalStorage.remove("admin_token");
        dispatch(logout());
    })
    return (
        <div>
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress color="primary" />
            </Backdrop>
            <SectionTitle title="Reset Password"/>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col className="my-3">
                            <Input fullWidth name="username" placeholder="Email or Mobile" required value={resetDetails.username} onChange={handleChange}/>
                        </Col>
                    </Row>
                    {
                        verified?
                        <>
                        <Row>
                            <Col md="6" sm="6" className="my-3">
                                <Input fullWidth error={resetDetails.password!=resetDetails.confirm_password} name="password" type="password" placeholder="Password.." onChange={handleChange} value={resetDetails.password} required/>
                            </Col>
                            <Col md="6" sm="6" className="my-3">
                                <Input fullWidth error={resetDetails.password!=resetDetails.confirm_password} name="confirm_password" type="password" placeholder="Confirm Password" onChange={handleChange} value={resetDetails.confirm_password} required/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Input fullWidth name="otp" minlength="4" required onChange={handleChange} value={resetDetails.otp} placeholder="Enter OTP.."/>
                            </Col>
                        </Row>
                        <Row className="my-1">
                            <Col>
                                <ResendOtp userId={resetDetails.managerId} isVerified={true}/>
                            </Col>
                        </Row>
                        </>
                        :null
                    }
                    <Row className="my-3 text-center">
                        <Col>
                            <Button color="primary" variant="filled">{verified?"Reset Password":"Send OTP"}</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}
export default ResetPassword;