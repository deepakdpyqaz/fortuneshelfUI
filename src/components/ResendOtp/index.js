import axios from "axios";
import { useAlert } from "react-alert";
const ResendOtp = (props) => {
    const alert = useAlert();
    const resendRequest = (e) => {
        e.preventDefault();
        axios.post("/user/send_otp",{
            "email":props.email||null,
            "mobile":props.mobile||null,
            "isVerified":props.isVerified||false,
            "userId":props.userId||null
        }).then(()=>{
            alert.success("OTP Sent succesfully");
        }).catch(()=>{
            alert.error("Error in sending otp");
        })
    }
    return(
        <a  onClick={resendRequest} className="link">Resend OTP</a>
    )
}

export default ResendOtp;