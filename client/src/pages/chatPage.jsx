import smileIcon from '../assets/images/smile.png'
import userIcon from '../assets/images/user.svg';
import editIcon from '../assets/images/edit.svg'
import deleteIcon from '../assets/images/delete.svg'
import goBackIcon from '../assets/images/arrow-left.svg'
import burgerIcon from '../assets/images/menu.png'
import sendIcon from '../assets/images/send.png'
import addIcon from '../assets/images/add.svg'
import tickIcon from '../assets/images/check.svg'

import { useState,useRef, useEffect, useContext } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { AppContext } from '../App';
import uploadFile from '../utils/fileUpload';
import ChatPersonProfile from '../components/chatPersonProfile';
//import ChatOptions from '../components/ChatOptions';
//import { io } from 'socket.io-client';
import {toast} from 'sonner'
import postApi from '../utils/postApi';
import UserFetch from '../utils/userFetch';
//const base='http://localhost:3000'
function ChatPage({setShowChat,chatPerson,socket}) {
    const {userData,logout}=useContext(AppContext)
    const [chatOpt,setChatOpt]=useState(false);
    const demoRef=useRef()
    const inputRef=useRef()
    const {getData,navigate}=UserFetch();
    const [inputValue, setInputValue] = useState('');
    const [showEmoji, setshowEmoji] = useState(false);
    const [fileData,setFileData]=useState(null)
    const [msgArr,setMsgArr]=useState([])
    //const socket=io('http://localhost:3000',{withCredentials:true})
    const [chatId,setChatId]=useState(null)
    const [isEdit,setIsEdit]=useState(false)
    const [isEveryOne,setIsEveryOne]=useState(0)
    const [showDelete,setShowDelete]=useState(false)
    const [showChatProfile,setShowChatProfile]=useState(false)
    const [image,setImage]=useState(null)
    const [showClear,setShowClear]=useState(false)    
    
     function sortByDate(messages){
        console.log('entered sortBydate')
        console.log('length is '+messages.length)
        const groupedMessages =  messages.reduce((acc, message) => {
            console.log(message)
            const date = new Date(message.createdAt);
            const messageDate = date.toLocaleDateString(); // Converts to local date string (e.g., "8/18/2024")
          
            if (!acc[messageDate]) {
              acc[messageDate] = [];
            }
          
            acc[messageDate].push(message);
          
            return acc;
          }, {});
        return groupedMessages;
    }
    const demoSort=sortByDate(msgArr)
    console.log(demoSort)
   
    function recvMsg(data){
        console.log('received data from data');
        let dummyArr=[...msgArr]
        console.log(dummyArr)
        setMsgArr(msgs=>[...msgs, data ])
        console.log(data);
    }
    //initailize the socket,create room get the data from db
    useEffect(()=>{//may be in this useEffect or another useEffect try to get all msg,and // chat collection id, which would be used as room name 
        console.log(chatPerson)
       userData._id===chatPerson._id ?
        socket.emit('create_private_room', {sender:userData._id})//chat_id use panum  //{room:'demo',recvr:recvr,sender:senderId}
       :socket.emit('create_room', {sender:userData._id,recvr:chatPerson._id})//chat_id use panum  //{room:'demo',recvr:recvr,sender:senderId}

        socket.on('recv_msgList',(data)=>{
            console.log('Im receivng msg from socket server')
            console.log('im in recv_msgList');
            //arr:msgArr,chatId:id
            console.log(data);
            //data.arr.length>0?
             setMsgArr(data.arr);//: '';
            setChatId(data.chatId)
            console.log('recv_msgList is executed')   
            console.log(chatId)
        }) 
       
        return()=>{
            socket.off('recv_msgList')
        }
    },[chatPerson])
    //receives data which is edited
    useEffect(()=>{    
        console.log('IM executed i m the problem for u')
        console.log(msgArr.length)
        socket.on('recv_edit_msg',async(data)=>{
            console.log(msgArr.length)
            console.log('received data is ')
            console.log(data)
            setMsgArr(mArr=>mArr.map(msg=>msg._id===data._id?data:msg))
        })  
        return ()=>socket.off('recv_edit_msg')      
    },[])
/*
    useEffect(()=>{
        socket.on('auth_err',(msg)=>{
            // socket.disconnect(true)
            console.log(msg)
            logout()
            navigate('/')
            alert('Session expired try logging in again')
        })
        return ()=>socket.off('auth_err')
    },[])
*/    

    //hanldes delete operation initiated by user's delteall
    useEffect(()=>{
        socket.on('handle_delete_all',(arr)=>{
            console.log(arr)
            console.log('in handle_delete_all')
            console.log(msgArr)
            setMsgArr(prevArr=>prevArr.filter(msg=> !arr.includes(msg._id)))
        })
        return ()=>socket.off('handle_delete_all')
    },[])//receive normal msg
    useEffect(()=>{
        socket.on('recv_msg',(data)=>recvMsg(data)) 
        return ()=> socket.off('recv_msg')   
    },[])
   // const [imageUrl,setImageUrl]=useState('')
    function handleFileChange(event){//check whether the file is image also max_length 5mb
        const file=event.target.files[0]
        console.log(file);
        if(file){
            const validImgTypes=['image/jpeg','image/png','image/gif','image/svg','image/jpeg']
            const maxSize=1024*1024*5
            if(!validImgTypes.includes(file.type.toLowerCase())){
                toast.error('Invalid file format!, please upload valid files,(JPEG,JPG,PNG,GIF,SVG)',{duration:3000})        
                console.log('in if ok ok ')
            }
            else if(file.size>maxSize){
               toast.error('Maximum allowed file size is 5mb')   
            }else{
                const reader=new FileReader();
                reader.onloadend=()=>{
                    setImage(reader.result)
                };
                reader.readAsDataURL(file)
            }
            setFileData(file)
            //logic to insert file to fiebase and return image url
            console.log(fileData?.name);    
    
        }
    }
    function sendImage(){
        if(fileData!==null){
            setImage(null)    
            uploadFile(fileData).then(data=>{
                console.log(data)
               // setImageUrl(data)
                //socket.emit('send_file',{imgUrl:imgUrl})
                console.log('userId is ');
                console.log(userData._id);
                console.log('recvr id is ');
                console.log(chatPerson._id);
                console.log(chatId)
                socket.emit('send_msg',{sender:userData._id,recvr:chatPerson._id,msgData:{
                   chatId,senderId:userData._id, data:data,isFileType:true,createdAt:new Date()
                },name:(userData.fname+' '+userData.lname)})
                setInputValue('')
             //   setImageUrl('')
                fileData? setFileData(null):''                            
            })
    
        }else{
            alert('image not uploaded')
        }
    }
    function handleBackbtn(){
        setShowDelete(false)
        socket.disconnect()
        setShowChat(false)
        setMsgArr([])
        setChatId(null)
        setIsEveryOne(0)
    }
    function handleEmoji(event){
      console.log(event);
      setInputValue((prev)=> (prev+event.emoji))
      console.log(event.emoji);
      console.log(inputValue);  
    }
    function handleEnter(event){
        if(event.key==='Enter'){
            console.log('enter kley pressed')
            sendMsg()
        }
    }
    function sendMsg(){
        if(!isEdit){
            console.log('send msg clicked');
            if(inputValue!==''){
               // console.log(imageUrl)
                console.log('userId is ');
                console.log(userData._id);
                console.log('recvr id is ');
                console.log(chatPerson._id);
               // let isFile=imageUrl!==''//inputValue==='';
                let data=inputValue;
                console.log(chatId)
                socket.emit('send_msg',{sender:userData._id,recvr:chatPerson._id,msgData:{
                   chatId,senderId:userData._id, data:data,isFileType:false,createdAt:new Date()
                },name:(userData.fname+' '+userData.lname)})
                setInputValue('')
                fileData? setFileData(null):''                        
            }else{
                toast.error('please enter some data to send')
            }    
        }else{
            if(inputValue!==''||inputValue!==null){                
                console.log({chatId:chatId,msgId:selectedChats[0], msgValue:inputValue})
                socket.emit('edit_msg',{
                    chatId,msgId:selectedChats[0], msgValue:inputValue
                 })
                 setInputValue('')
                 fileData? setFileData(null):''                        
                 //setMsgArr(chatItem) //need database action
                setSelectedChats([])
                setIsEdit(false)
            }else{
                alert('please enter some value to edit')
            }
        }
    }
    function handleMsgOptn(id){
        console.log(msgArr[id])
    }
    useEffect(()=>{
        demoRef.current.scrollIntoView({behavior:'smooth'})
    },[msgArr])

    const [selectedChats,setSelectedChats]=useState([])

    function handleClick(id){//id is
        showDelete? (setShowDelete(false),setIsEdit(0)):''
        if(selectedChats.includes(id)){
            let demo=selectedChats.filter((elem)=>elem!=id)
            setSelectedChats(demo)
        }else{
            setSelectedChats(prev=>[...prev,id])
        }
    }

    function editMessage(){
        inputRef.current.focus()
        setIsEdit(true)
        const id=selectedChats[0]
        const msgEditdata=msgArr.filter((msg=>msg._id===id))[0];
        console.log('msgEditdata')
        console.log(msgEditdata)
        setInputValue(msgEditdata.data)
    }
    function deleteMessage(){
        let temp=0//here elem is id of selelctedChats
        msgArr.map(msg=>{
            if(selectedChats.includes(msg._id)){
                msg.senderId===userData._id ? temp++ : 0;
            }
        })
        setIsEveryOne(temp)
        setShowDelete(true)
    }
    function handleDeleteAll(){//delete for all-> this is executed only when all msgs are send by that particular user
        console.log('in handle delete all')
        setShowDelete(false)
        let msgIdArr=selectedChats
        let fileDataArr=[]
        msgArr.map(msg=>{
            if(selectedChats.includes(msg._id)){
                if(msg.isFileType) fileDataArr.push(msg.data)
            }
        })
        
        console.log(msgIdArr)
        //handle socket
        socket.emit('delete_msg',{sender:userData._id,arr:msgIdArr,fileDataArr,chatId:chatId})
        setSelectedChats([])
    }
    function handleDelete(){//delete for only 1 user
        setShowDelete(false)
       let msgIdArr=selectedChats;
       const msgDeletearr=msgArr.filter(msg=>!selectedChats.includes(msg._id))
       setMsgArr(msgDeletearr)
        socket.emit('delete_for_me',{sender:userData._id,msgIdArr})
        setSelectedChats([])
        console.log('msgDeletearr')
        console.log(msgDeletearr)
    }
    function handleClearChat(){
        setShowClear(false)
        console.log('from clear chat')
        console.log(chatId)
        console.log(userData._id);
        if(userData._id!==undefined || chatId!==undefined||msgArr.length>0){
            postApi('/clear-chat',{userId:userData._id,chatId:chatId},(res)=>{
                console.log(res);
                setMsgArr([])
                toast.success(res.msg)
            },(res)=>{
                console.log(res)
                toast.error(res.msg)
            })
        }
    }
  return (
    <>
    <div className='w-100 bg-secondary flex-column justify-content-between' style={{maxHeight:'100vh',minHeight:'100vh',display:showChatProfile?'none':'flex'}} >
        <div className="chatNav d-flex flex-row bg-light" style={image?{minHeight:'11vh'}:{}}>
            <div  className="user d-flex flex-row p-2 align-items-center gap-2 justify-content-between w-100 ">
                {isEdit?
                <div className="d-flex flex-row align-items-center gap-3 ps-3 w-75  justify-content-start">
                    <img src={goBackIcon} alt="" height={25} onClick={()=>{setIsEdit(false),setSelectedChats([]),setInputValue('')}} />
                    <span style={{fontSize:'25px',fontWeight:'bold'}}>Edit message</span>
                </div>  
            :(selectedChats.length===0?
                <div className="d-flex flex-row align-items-center gap-3" onClick={()=>setShowChatProfile(true)} style={{minWidth:'85%'}}>
                    <img src={goBackIcon} alt="" height={30} onClick={handleBackbtn} />
                    <img src={chatPerson.profile===''? userIcon:chatPerson.profile} alt="" style={{ borderRadius:'50%', height:'50px',minWidth:'50px',backgroundColor:'#60a4f6fc',border:'2px solid',padding:'2px' }} />
                    <div className="d-flex flex-column justify-content-between" style={{overflowX:'hidden'}} >
                        <h4 className='m-0'>{(chatPerson.fname===''?'Deleted':chatPerson.fname)+''+(chatPerson.lname===''?'Account':chatPerson.lname)+(chatPerson._id===userData._id? '(You)':'')}</h4>
                        <p className='m-0'>{ chatPerson._id===userData._id? 'Message yourself':chatPerson.time}</p>
                    </div>
                </div>:
                <div className="d-flex flex-row align-items-center gap-3 ps-3 w-75  justify-content-between">
                    <img src={goBackIcon} alt="" height={25} onClick={()=>setSelectedChats([])} />
                    <span style={{fontSize:'30px',fontWeight:'bold'}}>{selectedChats.length}</span>
                    <div className="d-flex flex-row justify-content-between p-2 ps-4 gap-3">
                        {(selectedChats.length===1 && msgArr.filter(msg=>(msg._id===selectedChats[0] && !msg.isFileType))[0]?.senderId===userData._id) && <img src={editIcon} height={25} width={25} alt="" onClick={editMessage} /> }
                        <img src={deleteIcon} height={25} width={25} alt="" onClick={deleteMessage} />
                    </div>
                </div>)  
                }

                <img src={burgerIcon} alt="" height={30} onClick={()=>setChatOpt(!chatOpt)} />
            </div>
        </div>

    {image ?<>
        <div className='imageContain  w-100 bg-info p-3' style={image?{display:'flex'}:{display:'none'}}>
            <p style={{alignSelf:'start'}}> 
                <span className='image_close' onClick={()=>setImage(null)}>X</span>
            </p>
            <div className='d-flex align-items-center justify-content-center'>
                <img src={image} style={{minHeight:'200px',maxHeight:'45vh'}} alt="" />
            </div>            
            <img className='iconclass iconclass2' src={sendIcon} alt=""    onClick={sendImage} />
        </div>   
    </>:<>
        <div className="chatBody  py-3" style={{maxHeight:'80vh',overflowY:'scroll',position:'relative',display:image?'none':'block'}} onClick={()=>setChatOpt(false)}>
            {Object.entries(demoSort).map((elem,index11)=>{ //here by using map in addition to Object.entries we get elem which is [key,value] access by elem[0] elem[1]
                console.log(elem)
                return <div className="oneDay  d-flex flex-column gap-2" onClick={()=>setChatOpt(false)} key={index11} >
                <div className="text-center">{elem[0]}</div>
                {elem[1].map((msg,index)=>{
                    let time=new Date(msg.createdAt).getHours()+':'+new Date(msg.createdAt).getMinutes()
                    return(
                        <div id={index} className={`d-flex flex-row px-3 py-1 ${msg.senderId===userData._id? 'justify-content-end':'justify-content-start'}` } key={index} 
                           // onMouseDown={()=>setTimeout(handleLongPress(index),500)} 
                           // onMouseUp={()=>clearTimeout()}
                            onClick={()=>handleClick(msg._id)} style={selectedChats.includes(msg._id)?{backgroundColor:'#2e7eaebd'}:{}} 
                        >   
                            <div  className={`chatDiv  p-1 ${msg.senderId===userData._id ? ' bg-success':'  bg-light'}` }>
                                {msg.isFileType? <img src={msg.data} className='imgMsg' /> : <p>{msg.data}</p> }
                                <span className=''>{time}</span>
                            </div>
                        </div>)
                })
                }
            </div>
            })}
            
            <div ref={demoRef}></div>            
        </div>

        {chatOpt?   <div className="chatOpt bg-dark text-light p-2 d-flex flex-column  py-3" style={{minHeight:'150px'}}>
                {chatPerson._id===userData._id?'':<>
                    <p>Report</p>
                    <p>Block</p>
                    <p>Mute Notification</p>
                </>                    
                }
                <p onClick={()=>{ msgArr.length>0?
                    (setShowClear(true),setChatOpt(false)):setChatOpt(false)
                }}>Clear chat</p>             
            </div>:''
        }
        {showClear? 
            <div className='clearDiv d-flex flex-column justify-content-between p-3  gap-2 showmsg bg-dark text-light' >
                <h3 className="text-center m-0 mt-1  mb-1 "><b> Clear this chat?</b></h3>
                <p className="text-center m-0  mb-3" style={{fontWeight:'bold'}}>Are you sure want to clear this chat </p>
                <div className="d-flex flex-row w-100 sbtndiv   gap-2">
                    <button className="accBtn btn btn-outline-light " onClick={()=>setShowClear(false)} >Cancel </button>
                    <button className="accBtn btn " style={{color:'white',backgroundColor:'#e82626'}}  onClick={handleClearChat}> Clear chat </button>
                </div>
            </div>:''
        }
        {showDelete&&
            <div className="deleteOpt bg-dark text-light p-4 d-flex flex-column  py-3" style={{position:'absolute',top:'30%',right:'10%',minWidth:'230px',borderRadius:'15px'}}>
                <p>Delete message?</p>
                <div className='d-flex flex-column align-items-end'>
                    {
                        isEveryOne===selectedChats.length ?
                            <p onClick={handleDeleteAll}>Delete for everyOne</p>:""
                    }
                    <p onClick={handleDelete}>Delete for me</p>
                    <p onClick={()=>{setShowDelete(false)}}>Cancel</p>                
                </div>
            </div>
        }
        <div>
            {chatPerson.fname!==''?
            <>
                <div className="chatFoot d-flex flex-row gap-2 align-items-center p-2 bg-light">
                    <img className='iconclass' src={smileIcon} alt="" height={30} onClick={()=>setshowEmoji(!showEmoji)} />
                    <input type="text" className='form-control chatmsg' ref={inputRef}
                        value={inputValue} onChange={(event)=>setInputValue(event.target.value)}
                        name="" id="" placeholder='Write a message' onKeyDown={handleEnter} />
                    <input type='file' name="" id="fileInput" accept='image/*' style={{display:'none'}} onChange={handleFileChange} />
                    <label htmlFor="fileInput">
                        <img className='iconclass' src={addIcon} alt=""   height={30} />
                    </label>
                    <img className='iconclass' src={isEdit?tickIcon: sendIcon} alt="" height={30} onClick={sendMsg} />
                </div>
                { showEmoji && <EmojiPicker onEmojiClick={handleEmoji} className='emojiDemo' style={{overflowY:'scroll',height:'45vh',maxHeight:'400px'}} />}        
            </>:<button className='w-100 p-2 btn btn-outline-primary'>Delete this chat</button>
            }
        </div>
    </>
    }

    </div>
    <ChatPersonProfile setShowChatProfile={setShowChatProfile} showChatProfile={showChatProfile} chatPerson={chatPerson} msgArr={msgArr} />
    </>

  )
}
export default ChatPage;

//style={{display:imageUrl===''?'none':'block'}}
/*
    //const [imageUrl,setImageUrl]=useState('')
    async function handleChange(event){
        console.log(event.target.files[0]);
        const image=event.target.files[0];
        if(image){
            try{
                setUploading(true)
                const storage=getStorage(app)
                let iName=image.name
                let dotindex=(iName).lastIndexOf('.')
                let fileName=(iName).substring(0,dotindex).replace(/[ .()]+/g,'');
                let fileExt=(iName).substring(dotindex+1)
                let fileNamewithExt=`${fileName}_${Date.now()}.${fileExt}`
                console.log(fileNamewithExt);
                
                const storageRef=ref(storage,"images/profile"+fileNamewithExt);
                await uploadBytes(storageRef,image)
                const downloadUrl=await getDownloadURL(storageRef);
                console.log(downloadUrl);
                setImageUrl(downloadUrl) 
                //here write the code to upload it to db
                
                setUploading(false)      
            }catch(err){
                console.log('some error occured');
                console.log(err);
            }
        }
        
    }
*/
//                {image&& <img src={image} height={100} width={100} />}
/*
    if(msgArr.length===0){
        socket.emit('create_chat',{sender:userData._id,recvr:chatPerson._id,data,isFile,time:new Date()})
    }else{
        socket.emit('send_msg',{sender:userData._id,recvr:chatPerson._id,data,isFile,time:new Date()})
    }  */                      
    //   postApi(`${base}/send-msg`)
/*
    function handleLongPress(i){//selects an item
        setLongPress(true)
        setSelectedChats([i])
    }
    function handleClick(){//deselects an item
        
    }
    const [longPress,setLongPress]=useState(false)
    const [selectedChats,setSelectedChats]=useState([])

onMouseDown={()=>setTimeout(handleLongPress(index),500)} 
                     onMouseUp={()=>clearTimeout()}
                     onClick={handleClick} style={selectedChats.includes(index)?{fontWeight:'bold'}:{}} 
*/
//                            <img className=' mt-3' src={burgerIcon} height={20} width={20} alt="" onClick={()=>handleMsgOptn(index)} />
/*
    const [longPress,setLongPress]=useState(false)

    function handleLongPress(i){//selects an item
        setLongPress(true)
        setSelectedChats([i])
    }

*/
/*
    async function demo(){
        if(chatId===null){
            await socket.emit('create_room', {sender:userData._id,recvr:chatPerson._id})//chat_id use panum  //{room:'demo',recvr:recvr,sender:senderId}
        }
    }
*/