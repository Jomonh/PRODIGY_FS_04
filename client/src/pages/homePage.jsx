import {useState,useEffect,useContext, useRef} from 'react';
import ChatPage from './chatPage';
import bugerIcon from '../assets/images/menu.png';
import userIcon from '../assets/images/user.svg'
import searchIcon from '../assets/images/search.png';
import imageIcon from '../assets/images/image.png'
import ProfileComp from '../components/ProfileComponent';
import UserFetch from '../utils/userFetch';
import { io } from 'socket.io-client';
import { AppContext } from '../App';
import { Toaster,toast } from 'sonner';
const base='http://localhost:3000'
function HomePage() {
  const socket=io('http://localhost:3000',{withCredentials:true})
  const {axios,navigate,getData}=UserFetch()
  const {login,logout,isLoggedIn,userData,setUserData}=useContext(AppContext)
  const [showChat,setShowChat]=useState(false);
  const [smallScreen,setSmallScreen]=useState(true);// true if a small screen
  const [showProfile,setShowProfile]=useState(false)
  const [userList,setUserList]=useState([])
  const [chatPerson,setChatPerson]=useState({})
  function getUserList(){
    axios.get(`${base}/get-userList`)
    .then(res=>res.data)
    .then(data=>{
      if(data.status===200){
        console.log('succcess');
        console.log(data);
        setUserList(data.arr)
      }else if(data.status===405||data.status===404){
        alert(' expired Session')
        logout()
        navigate('/')
      }else{
        console.log('some issues');
        console.log(data)
      }
    }).catch((err)=>{
      console.log('some error occured');
      console.log(err);
    })
  }
  useEffect(()=>{//get the notification event of socket here and display a toast
    socket.on('connect',()=>{
      console.log('connected'+userData.email);   
      //need to write the logic to create a room with users _id 
      //which will be used to send notifcation
      socket.emit('createNotifyRoom',userData._id)
    })
    socket.on('recvNotify',(data)=>{//to get the notification of any msg
      console.log('msg from necv notify')
      console.log(data)
      //in both the setUserList i just search whether the userList's _id matches with senderId in case of recvr or msg with myself, recvrId in case of sender  
      if(data.sender===data.recvr||userData._id===data.sender){//no need notification as either he is sender or msg with himself
        setUserList(prevList=>prevList.map(user=>user._id===data.recvr?{...user,lastMsg:data.msg,lastMsgType:data.lastMsgType}:user))
        console.log(userList) 
        console.log(userList)
      }else{//need notification as he is reciever
          setUserList(prevList=>prevList.map(user=>user._id===data.sender?{...user,lastMsg:data.msg,lastMsgType:data.lastMsgType}:user))
          toast.info(data.name+', send you a message')
      }
    })//data:data.data,user1:sender,user2:recvr
    /*
    socket.on('recv_lastMsg',(data)=>{
      console.log('from recv lastmstg')
      let listUserId=userData._id===data.user1?data.user1: data.user2
      setUserList(prevList=>prevList.map(elem=>elem._id===listUserId?elem.data=data.data:elem.data))
    })*/
    socket.on('disconnect',()=>{
      console.log('disconnected '+userData.email);
      alert('disconnected')
    })
    socket.on('auth_err',(msg)=>{
      // socket.disconnect(true)
      console.log(msg)
      logout()
      navigate('/')
      alert('Session expired try logging in again')
    })
    return()=>{
      socket.off('connect')
      socket.off('auth_err')
      socket.off('disconnect')
      socket.off('recvNotify')
    }
  },[])

  useEffect(()=>{
    getUserList()
  },[])

  const handleResize=()=>{
    if(window.innerWidth<800){
      setSmallScreen(true)  //setShowChat(false)
    }else{
      setSmallScreen(false) // setShowChat(true)
    }
  }
  function handleUserClick(recvr,senderId){
    setChatPerson(recvr)
    setShowChat(true)
  }
  useEffect(()=>{
    handleResize();
    window.addEventListener('resize',handleResize);

    return()=>{
      window.removeEventListener('resize',handleResize)
    }
  },[])
  return (
    <div className='d-flex flex-row p-0 gap-2 bg-dark'>
        {//showChat && smallScreen ? '':
        <div className="chatHome bg-primary p-1 flex-column" style={{ width:'100vw',
          minHeight:'100vh', maxHeight:'100vh',display:(showChat && smallScreen) ?'none':'flex'
         // maxWidth:'400px',
          }}>              
            <div className="d-flex flex-row justify-content-between align-items-center p-2 px-4  ">
                <h3>Chat app</h3>
                <img src={bugerIcon} width={30} height={30} style={{cursor:'pointer'}}  onClick={()=>setShowProfile(true)} />
            </div>
            <div className='d-flex flex-row justify-content-around align-items-center p-2 gap-1'>
                <input type="text"className='form-control mb-1 searchbar' name="user" id="" />
                <img src={searchIcon} alt="" className='searchbtn' />
            </div>
            <div className="userListContainer">
            <div className="userList bg-warning">
              {userList.map((user,index)=>{
                  let size=smallScreen? 40:50
                  return(
                    <div key={index} className="user d-flex flex-row p-2 align-items-center gap-2 " onClick={()=>{handleUserClick(user,userData._id)}}>
                      <img src={user.profile==''?userIcon:user.profile} alt="" style={{ borderRadius:'50%', height:size,minWidth:size,backgroundColor:'#60a4f6fc' }} />
                      <div className="usercontent d-flex flex-column py-2 px-2 gap-1 w-100" style={{minWidth:'240px'}}>
                        <div className="d-flex flex-row justify-content-between">
                          <h4 className='m-0'>{(user.fname===''?'Deleted':user.fname)+' '+(user.lname===''?'Account':user.lname)+(user._id===userData._id? '(You)':'')}</h4>
                          <p className='m-0'>{user.time}</p>
                        </div>
                        <div className="d-flex flex-row justify-content-between">
                          {user.lastMsgType?
                          <img src={imageIcon} height={25} width={25} />:
                          <p className='m-0' style={{maxWidth:'70%',overflow:'hidden',maxHeight:'30px'}}>{(user?.lastMsg===''||user.lastMsg===undefined)?'No messages here yet!':user.lastMsg}</p>                          
                          }
                        </div>
                      </div>
                    </div>
                  )
              })

              }
            </div>
            </div>

            {showProfile? <ProfileComp setShowProfile={setShowProfile} />:'' }
        </div>
        }
        {showChat && (smallScreen || !smallScreen) ?
          <ChatPage setShowChat={setShowChat} chatPerson={chatPerson} socket={socket} /> :  (!smallScreen?
              <div className="d-flex justify-content-center align-items-center" style={{minHeight:'100vh',width:'100%'}}>
                 <h1 className='text-light text-center '>This is a chat page</h1> 
              </div>
          :null)
        }
      <Toaster richColors={true} position='top-center'  />
    </div>
  )
}
export default HomePage;
/*
 (!smallScreen? <h1 className='text-light text-center w-100 h-100'>This is a chat page</h1> :'')
*/
  /*
  {
      profile:'',
      fname:'Hacky',
      lname:'Lazy',
      time:'20;05',
      lastMsg:'Hey dude what is ...'
    }
  */