import axios from "axios";
import { useState } from "react";
import { useAlert } from "react-alert";
const ResendOtp = (props) => {
    const alert = useAlert();
    const [disabled,setDisabled]= useState(false);
    const [time,setTime] = useState(60);
    let timerVar = 60;
    const resendRequest = (e) => {
        e.preventDefault();
        setDisabled(true);
        setTimeout(()=>{
            setDisabled(false);
        },5000*60);
        let timer = setInterval(()=>{
            if(timerVar>1){
                setTime((data)=>{
                    console.log(data)
                    return (data-1);
                })
                timerVar--;
            }
            else{
                timerVar=60;
                setTime(60);
                setDisabled(false);
                clearInterval(timer);
            }
        },1000)
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
            disabled?`${Math.floor(time/60)}:${String(time%60).padStart(2,'0')}`:
            <a  onClick={resendRequest} className="link">Resend OTP</a>
        
    )
}

export default ResendOtp;