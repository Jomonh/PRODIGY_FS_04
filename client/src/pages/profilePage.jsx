import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import backBtn from '../assets/images/arrow-left.svg'
import userIcon from '../assets/images/user.svg'
import editIcon from '../assets/images/edit.svg'
//import addIcon from '../assets/images/add.svg'
//import deleteIcon from '../assets/images/delete.svg'
import tickIcon from '../assets/images/check.svg'
import UserFetch from '../utils/userFetch';
import postApi from '../utils/postApi';
import uploadFile from '../utils/fileUpload';
import { AppContext } from '../App';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form'
import { Toaster,toast } from 'sonner';
function ProfilePage() {
  const [showEdit,setShowEdit]=useState(false)
  const [showProfileEdit,setShowProfileEdit]=useState(false)
  const [showDelete,setShowDelete]=useState(false)
  const {axios,getData,navigate}=UserFetch()
  const {isLoggedIn,userData,setUserData,logout}=useContext(AppContext)
  const createdDate=new Date(userData.createdAt).getDate()+'/'+(new Date(userData.createdAt).getMonth()+1 )+'/'+new Date(userData.createdAt).getFullYear()
  const [image,setImage]=useState(null)
  const [fileData,setFileData]=useState(null)
  function profileInfoEdit(data){
    event.preventDefault();
    console.log(data)
    console.log('in profileedit ')
    let editData=data
    reset()
    editData.email=userData.email
    console.log(editData)
    console.log('entered handle register');

    
    postApi(`/edit-profile`,editData,(res)=>{
        console.log(res);
        reset()
        toast.success('Profile info updated successfully')
        setShowEdit(false)
        setUserData(res.data)                

    },(res)=>{
        toast.error(res.msg,{duration:3000})        
        console.log(res);
    })     
     
}
function handleDeleteProfile(){
    console.log(userData)
    if(userData.profile!==''){
        setShowProfileEdit(false)
        postApi('/delete-profile',{userId:userData._id,oldProfile:userData.profile},
            (res)=>{
                console.log(res)
                setUserData(res.data)
                toast.success(res.msg)
            },(res)=>{
                toast.error(res.msg)
                console.log(res)
            }
        )
    }
}
function handleEditProfile(event){
    const file=event.target.files[0]
    console.log(file);
    if(file){
        const validImgTypes=['image/jpeg','image/png','image/gif','image/svg','image/jpeg']
        const maxSize=1024*1024*5
        if(!validImgTypes.includes(file.type.toLowerCase())){
            toast.error('Invalid file format!, please upload valid files,(JPEG,JPG,PNG,GIF,SVG)',{duration:3000})        
            console.log('in if ok ok ')
        }else if(file.size>maxSize){
           toast.error('Maximum allowed file size is 5mb')   
        }else{
            const reader=new FileReader();
            reader.onloadend=()=>{
                setImage(reader.result)
            };
            reader.readAsDataURL(file)
        }
        setShowProfileEdit(false)
        setFileData(file)
        //logic to insert file to fiebase and return image url
        console.log(fileData?.name);    
    }
}
function sendImage(){
    if(fileData!==null){
        setImage(null)    
        uploadFile(fileData).then(data=>{//here file is uploaded and we get data that is firebase url
            console.log(data)
            console.log('userId is ');
            console.log(userData._id);
            console.log('recvr id is ');
            postApi('/set-profile-pic',{userId:userData._id,oldProfile:userData.profile,newProfile:data},
                (res)=>{
                    setUserData(res.data)
                    toast.success(res.msg)
                },(res)=>{
                    toast.error(res.msg)
                }
            )
            fileData? setFileData(null):''                            
        })
    }else{
        alert('image not uploaded')
    }
}

function deleteAccount(){
    console.log('in delete account')
    console.log(userData)
    if(userData._id!==''){
        postApi('/delete-Account',{userData:userData._id},(res)=>{
            console.log(res)
            alert('Account deleted successfully,Thankyou for using our application!')
            toast.success('Account deleted successfully,Thankyou for using our application!')
            logout()
           // setUserData({})
            navigate('/')
        },(res)=>{
            console.log(res)
            toast.error(res.msg)
        })
    }    
}

const createAccountSchema=yup.object().shape({
    fname:yup.string().required('First name is required').min(3,'Firstname should be atleast 8 letters').max(15,'Lastname should not exceed 15 letter'),
    lname:yup.string().required('Last name is required').max(15,'Last name must be almost 15 letters'),
    passwd:yup.string().required('Password is required').min(8,'password should be atleast 8 letters').max(24,'maximum characters of password is 24'),
})

const {register,handleSubmit,reset,formState:{errors}}=useForm({
    resolver:yupResolver(createAccountSchema)
})
  
  return (
    <div className='bg-primary profilePage' style={{position:'relative'}} >
        <div className="prof-head bg-light d-flex flex-row p-2 gap-4 align-items-center" style={{height:"10vh"}}>
            <Link to='/home'>
                <img src={backBtn} height={25} width={25} alt="" />            
            </Link>
            <p className='m-0' style={{fontSize:'25px',fontWeight:600}} >Profile</p>
        </div>

        {image ?<div className='imageContain  w-100 bg-info p-3' style={image?{display:'flex'}:{display:'none'}}>
            <p style={{alignSelf:'start'}}> 
                <span className='image_close' onClick={()=>setImage(null)}>X</span>
            </p>
            <div className='d-flex align-items-center justify-content-center'>
                <img src={image} style={{minHeight:'200px',maxHeight:'45vh'}} alt="" />
            </div>            
            <img className='iconclass iconclass2' src={tickIcon} alt=""    onClick={sendImage} />
        </div>:''}

        <div className="bg-warning p-3  flex-column gap-2" style={{minHeight:'90vh',display:image!==null?'none':'flex'}}>
            <div>
                <img className='bg-light' src={userData.profile===''?userIcon:userData.profile} alt="" height={100} width={100} style={{borderRadius:'50%',border:'1px solid white',position:'relative'}} />
                <img src={editIcon} height={20} width={20} style={{position:'relative',left: 0,top: '30px'}} alt=""
                onClick={()=>{setShowProfileEdit(true),setShowEdit(false)}} />
            </div>
            <div className="prof-info p-1 py-3 mt-2" style={{overflowX:'auto'}}>
                <h4>Info</h4>
                <div className="ps-3 info1 d-flex flex-row align-items-center">
                    <div className="d-flex flex-column">
                        <p className='m-0' style={{fontSize:'18px'}}><b>{userData.fname+' '+userData.lname}</b></p>
                        <p className='mt-1'>Name</p>
                        <p className='m-0' style={{fontSize:'18px'}}><b>Nothing</b></p>
                        <p className='mt-1'>About</p>
                        <p className='m-0' style={{fontSize:'18px'}}><b>{userData.email}</b></p>
                        <p className='mt-1'>Email</p>
                        <p className='m-0' style={{fontSize:'18px'}}><b>{createdDate}</b></p>
                        <p className='mt-1'>CreatedAt</p>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={()=>{setShowEdit(true),setShowProfileEdit(false)}} style={{width:'100px'}}>Edit</button>
                <button className="btn btn-danger ms-2" onClick={()=>setShowDelete(true)} style={{width:'100px'}}>Delete</button>
            </div>
        </div>
        {showEdit?
            <div className="editProfileForm bg-info d-flex flex-column  align-items-center py-3" >
                        <h3 className='d-flex justify-content-around align-items-center w-100 py-2 mb-2'>Edit profile 
                        <span onClick={()=>setShowEdit(false)}>X</span>
                        </h3>
                        <form className="userForm py-2 d-flex flex-column gap-1" onSubmit={handleSubmit(profileInfoEdit)} style={{width:'85%'}} >
                            <label htmlFor="#fname" className='label-bold'>First Name:</label>
                            <input className='form-control mb-1' type="text" name="fname" id="fname"  {...register('fname')} defaultValue={userData.fname} placeholder='eg. john'  />
                            <p>{errors.fname?.message}</p>
                            <label htmlFor="#lname" className='label-bold'>Last Name:</label>
                            <input className='form-control mb-1' type="text" name="lname" id="lname"  {...register('lname')} defaultValue={userData.lname}  placeholder='eg. doe'  />
                            <p>{errors.lname?.message}</p>
                            <label htmlFor="#email" className='label-bold'>Email:</label>
                            <input className='form-control mb-1' type="email" name="email" id="email" disabled={true} value={userData.email}   placeholder='eg. john454@gmail.com' />
                            <label htmlFor="#passwd" className='label-bold'>Password:</label>
                            <input className='form-control mb-1' type="password" name="passwd" id="passwd" minLength={8} maxLength={20} {...register('passwd')} placeholder='eg. password123'  />
                            <p>{errors.passwd?.message}</p>
                            <button className='sbtn btn btn-success m-0 my-2 ' type="submit"  >
                                <p className='m-0 py-1 d-flex align-items-center justify-content-center gap-3 w-100'>Edit 
                                    <img src={editIcon} height='20px' width='20px' alt="" />
                                </p>
                            </button>            
                        </form>
            </div>:''
        }
        {showProfileEdit?
            <div className="deleteOpt bg-dark text-light p-4 d-flex flex-column  py-3 gap-2" style={{position:'absolute',top:'30%',right:'10%',minWidth:'230px',borderRadius:'15px'}}>
                <p>Edit Profile?</p>
                <div className='d-flex flex-column align-items-end gap-3'>
                    <input type="file" name="profilePic" id="profilePic" onChange={handleEditProfile} style={{display:'none'}}  />
                    {
                        userData.profile!=='' ?
                        <p onClick={handleDeleteProfile}> Remove photo</p>:''
                    }
                    <label htmlFor='profilePic'>Add Photo</label>
                    <p onClick={()=>{setShowProfileEdit(false)}}>Cancel</p>                
                </div>
            </div>:''
        }
        {showDelete ? 
            <div className='SignoutDiv d-flex flex-column justify-content-between p-4  gap-2 showmsg' >
                <h3 className="text-center m-0 mt-1  mb-3 text-danger"><b> Delete Account</b></h3>
                <p className="text-center m-0  mb-4" style={{fontWeight:'bold'}}>Are you sure want to <b className='text-danger' style={{fontSize:'18px'}}>Delete your account</b>   </p>
                <div className="d-flex flex-row w-100 sbtndiv   gap-2">
                    <button className="accBtn btn btn-outline-dark " onClick={()=>setShowDelete(false)} >Cancel </button>
                    <button className="accBtn btn " style={{color:'white',backgroundColor:'#e82626'}}  onClick={deleteAccount}> Delete Account </button>
                </div>
            </div>:''
        }

        <Toaster richColors={true}  />
    </div>
  )
}
export default ProfilePage;
