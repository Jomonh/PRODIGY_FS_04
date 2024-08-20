import { useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials=true;
//import { DefaultFn } from "../LoginPage";

const DefaultFn=(data)=>{
    const {logout}=useContext(AppContext)
    const navigate=useNavigate()
    alert('Session expired')
    logout()
    console.log(data.msg);
    navigate('/')
}
export default function postApi(url,reqData,successFn,failureFn) {
    
    const base='http://localhost:3000';
    axios.post(base+url,reqData)
    .then(res=>res.data)
    .then(data=>{
        if(data.status===200){
            console.log('Success');
            successFn(data);
        }else if(data.status===405){
            DefaultFn(data)
        }else{
            console.log('failure');
            failureFn(data);
        }
    }).catch((err)=>{
        console.log('some errror occured');
        console.log(err);
    })

    return 0;
}