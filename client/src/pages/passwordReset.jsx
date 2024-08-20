import  { useState ,useContext} from 'react'
//import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import fetchApi from '../utils/fetchApi';
import postApi from '../utils/postApi';
import { Toaster,toast } from 'sonner';
import { AppContext } from '../App';
//axios.defaults.withCredentials=true;
export default function PasswordReset() {
    const {setResetPass,resetPass}=useContext(AppContext)
    const [passwordData,setPasswordData]=useState({
        newpass:'',confirmpass:''
    })
    const navigate=useNavigate();
    function handleChange(event){
        const {name,value}=event.target
        setPasswordData(prev=> ({
            ...prev,[name]:value
        }) )
        console.log(passwordData);
    }
    function passwordReset(){
        console.log(passwordData);
        //api route to reset password
        if(passwordData.newpass===passwordData.confirmpass && passwordData.newpass!==''){
            console.log('valid password');
            let token=location.href.split('reset-pass/')[1]
            console.log(token);
            postApi(`/reset-password/:${token}`,{passwd:passwordData.newpass},()=>{
                alert('password reset success, try logging in with new password')
                console.log(resetPass);
                setResetPass(false)
                navigate('/')        
            },(res)=>{
                console.log(res.msg)
                alert(res.msg);
                setResetPass(false);
            })
        }else{
            //alert('invalid password')
            toast.warning('Invalid password')
        }
    }
  return (
    <div className='border d-flex align-items-center justify-content-center p-2' style={{minHeight:'100vh'}}>
        <div className="verificatnDiv p-4 d-flex flex-column align-items-center bg-light w-100 gap-3" style={{
            maxWidth:'400px', borderRadius:'13px',top:'10%', left:'5%'
            }}>
            <h3 className="m-0 d-flex flex-row gap-1 align-items-center ">
                Reset your Password</h3>
            <p className="m-0 ">Enter a new password below to change your password</p>
            <div className="passdiv d-flex flex-column gap-3 w-100">
                <label htmlFor="#newpass" className='label-bold '>New password</label>
                <input className='form-control' type="password" id='newpass' name='newpass' value={passwordData.newpass}  onChange={handleChange} required placeholder='eg. password123 '  />
                <p style={{color:'red'}}>{(passwordData.newpass.length>=8 && passwordData.newpass.length<=24)? '':'password length should be between 8 to 24' }</p>
                <label htmlFor="#confirmpass" className='label-bold '>Confirm password</label>
                <input className='form-control' type="password" id='confirmpass' name='confirmpass' value={passwordData.confirmpass}  onChange={handleChange} required placeholder='eg. password123 '  />
                <p style={{color:'red'}}> {(passwordData.newpass !==passwordData.confirmpass && passwordData.confirmpass.length>0) ?'Wrong password':'' }</p>
                <button className="btn btn-outline-primary w-100" onClick={passwordReset}>Change Password</button>
            </div>
        </div>
        <Toaster position='bottom-right' richColors={true} pauseWhenPageIsHidden={false}  />
    </div>
  )
}
