import { Link, useNavigate } from 'react-router-dom';
import userIcon from  '../assets/images/user.svg';
//import cancelIcon from '../assets/images/'
import { AppContext } from '../App';
import { useContext } from 'react';
import postApi from '../utils/postApi';
// eslint-disable-next-line react/prop-types
function ProfileComp({setShowProfile}){
    const {login,logout,userData}=useContext(AppContext)
    const navigate=useNavigate();
    function logoutUser(){
        postApi('/logout','',(res)=>{
          console.log(res);
          alert('logout success')
          logout()
          navigate('/')
        },(res)=>{
          console.log(res);
          logout()
          console.log('logout faliure');
          navigate('/')
        })
      }


    return(
        <div className="profile d-flex flex-column p-2 m-2 pt-3 bg-light" style={{
            position:'absolute', top:0,left:0,zIndex:2, 
            height:'100vh',
            width:'300px'
        }}>
            <div className="canvasHead">
                <h6 className='text-end' >
                  <span className=' bg-dark text-light p-2 py-1 cancelImg' 
                     onClick={()=>setShowProfile(false)}>X</span>  
                </h6>
            </div>
            <div className="canvasBody d-flex flex-column p-2 gap-2 mt-4" style={{overflow:'hidden'}}>
                <img src={userData.profile===''?userIcon:userData.profile} alt="" height={60} width={60} style={{border:'1px solid black',borderRadius:'50%',padding:'2px',backgroundColor:'white'}} />
                <p className='m-0'><b style={{fontSize:'22px'}}>{userData.fname+' '+userData.lname}</b></p>
                <p>{userData.email}</p>
                <Link to='/profile' className='btn btn-outline-primary'>View Profile</Link>
                <Link className='btn btn-outline-danger' onClick={logoutUser}>Logout</Link>
            </div>
        </div>
    )
  }
export default ProfileComp;