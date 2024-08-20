import {useRef,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import envelop from '../assets/images/envelope.svg';
import { AppContext } from '../App';
import axios from 'axios';
axios.defaults.withCredentials=true;
// eslint-disable-next-line react/prop-types
export default function OtpDiv({setShowOtp}) {
    const navigate=useNavigate()
    const otpValueRef=useRef(null)
   const {login,isLoggedIn,userData,setUserData}=useContext(AppContext);
    
    function verifyOtp(){
        
        console.log('verify otp clicked');
        console.log(otpValueRef.current.value);
        let otpval=otpValueRef.current.value
        console.log(typeof otpval);
        if(otpval!=='' && otpval.length===6){
            console.log('value is correct');
            axios.post('http://localhost:3000/verify-otp',{otpval:otpval})
            .then(res=>res.data)
            .then(data=>{
                if(data.status===200){
                    console.log('otp verified by server');//userType -> user, isLoggedIn=true
                    login()
                    setUserData(data.data)
                    setShowOtp(false)
                    navigate('/home',{replace:true})
                }else{
                    console.log('please enter correct otp');
                    console.log(data.msg,data.status);
                }
            }).catch((err)=>{
                console.log('some error occured');
                console.log(err);
                setShowOtp(false)
            })
        }
    }
    
    return (
    <div className="verificatnDiv p-4 d-flex flex-column align-items-center bg-light w-100 gap-3" style={{
        position:'absolute',
        maxWidth:'280px',
        borderRadius:'13px',
        top:'10%',
        left:'5%',
        boxShadow:'0 0 50px black'
        }}>
        <h3 className="m-0 d-flex flex-row gap-1 align-items-center">
            <img src={envelop} height={'25px'} width='25px' alt="" />
            Check your email</h3>
        <p className="m-0 ">Please enter the 6 digit verification code that was send. The code is only valid for 2 minutes</p>
        <div className="form-floating w-100">
            <input type='number' name="otp" id="otp" className="form-control" ref={otpValueRef} minLength={6} maxLength={6} required />
            <label htmlFor="#otp"><b>Verification Code</b></label>
        </div>
        <button className="btn btn-outline-primary w-100" onClick={verifyOtp}>Verify code</button>
    </div>
  )
}
