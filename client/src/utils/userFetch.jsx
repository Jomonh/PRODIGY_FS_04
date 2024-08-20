import {useEffect,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials=true;
import { AppContext } from '../App';
export default function UserFetch() {
    const navigate=useNavigate();
    //const [adminData,setAdminData]=useState({})
    const {login,logout,userData,setUserData}=useContext(AppContext)
    console.log('im inside userFetch file');
    
    function getData(){
        console.log('isLoggediN from userFetch');
        console.log(localStorage.getItem('isLoggedIn'));
        if(Object.keys(userData).length===0 && localStorage.getItem('isLoggedIn')==='true'){
            axios.get('http://localhost:3000/get-userData')
            .then(res=>res.data)
            .then((data)=>{
                console.log(data);
                if(data.status===200){
                    console.log('success');
                    login()
                    setUserData(data.data)
                    console.log('userdata from useEffect is ');
                    console.log(userData);
                    
                    
                }else{
                    logout()
                    alert('Session expired!')
                    console.log('failure');
                    navigate('/')
                }
            }).catch((err)=>{
                console.log('somew error occurd');
                logout()
                console.log(err);
                navigate('/')
          })  
        }else{
            console.log('user data  is present');
            console.log(userData);
        }
    }

    useEffect(()=>{
        console.log('executed from the useEffect');
        getData();
      },[userData])
    

    return {axios,navigate,getData};
}