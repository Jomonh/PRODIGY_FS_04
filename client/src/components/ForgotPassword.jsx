import {useRef,useContext} from 'react';
import postApi from '../utils/postApi';
import { AppContext } from '../App';
import { Toaster,toast } from 'sonner';
// eslint-disable-next-line react/prop-types
export default function ForgotPassword({setForgotPass}) {
    const emailRef=useRef();
    const {setResetPass,resetPass}=useContext(AppContext);
    
    function reqForgotPassword(){
        
        const emailval=emailRef.current.value;
        if(emailval!==''){
            console.log('email value is');
            console.log(emailval);//req to api
            postApi('/forgot-password',{email:emailval},()=>{
                console.log('success');
                toast.success('A password reset link is send to your email, its valid for 5 minutes')
                setForgotPass(false);
                setResetPass(true)
                console.log('resetPassword from forgotpass'+resetPass);
            },(res)=>{
                toast.error(res.msg)
                console.log(res)
            });
    
        }else{
            toast.warning('Email value is required to reset password')
            //console.log('email value is null');
        }
        
    }
    
    return (
    <div className="verificatnDiv p-4 d-flex flex-column align-items-center bg-light w-100 gap-3" style={{
        position:'absolute', maxWidth:'280px',
        borderRadius:'13px', top:'10%', left:'5%',                        
        boxShadow:'0 0 50px black'
        }}>
        <h3 className="m-0 d-flex flex-row gap-1 align-items-center">
            Enter email for password reset 
            <span><b className='pointer' onClick={()=>setForgotPass(false)}>x</b></span>
        </h3>
        <p className="m-0 ">Please enter your email,we send the password reset link in mail. The link is only valid for 5 minutes</p>
        <div className="form-floating w-100">
            <input type='email' name="resetpass" id="resetpass" className="form-control" ref={emailRef}  required />
            <label htmlFor="#resetpass"><b>Email</b></label>
        </div>
        <button  onClick={reqForgotPassword} className="btn btn-outline-primary w-100" >Request password reset</button>        
    </div>)
}
