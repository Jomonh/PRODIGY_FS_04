//import React from 'react'
import goBackIcon from '../assets/images/arrow-left.svg'
import burgerIcon from '../assets/images/menu.png'
import userIcon from '../assets/images/user.svg'
import dislikeIcon from '../assets/images/dont-like.png'
import muteIcon from '../assets/images/bell.png'
import blockIcon from '../assets/images/block.png'
// eslint-disable-next-line react/prop-types
function ChatPersonProfile({chatPerson,showChatProfile,setShowChatProfile,msgArr}) {
    const dataArr=msgArr.filter((msg)=>msg.isFileType)
  return (
    <div className='chatPersonProfile w-100 h-100  flex-column justify-content-around p-3 pt-0 text-light' 
        style={{display:showChatProfile?'flex':'none',minHeight:'100vh'}}>
    <div className="nav d-flex flex-row align-items-center justify-content-between" style={{height:'10vh'}}>
        <img src={goBackIcon} alt="" height={30} width={30} onClick={()=>setShowChatProfile(false)} />
        <img src={burgerIcon} alt="" height={30} width={30} />
    </div>
    <div className="d-flex flex-column gap-2 align-items-center">
        <img src={chatPerson.profile!==''?chatPerson.profile:userIcon} height={120} width={120} style={{borderRadius:'50%',border:'2px solid'}} alt="" />
        <h3>{chatPerson.fname+' '+chatPerson.lname}</h3>
        <p>{chatPerson.email}</p>                
    </div>
    <br />
    <div className="d-flex flex-row flex-wrap bg-light gap-1 p-1" style={{maxHeight:'20vh',overflowY:'auto',borderRadius:'10px'}}>
        {dataArr.map((data,i)=>{
            return <div key={i}> <img src={data.data} height={100} width={100} /> </div>
        })

        }
    </div>
    <div className="ChatPersonOpt d-flex flex-column gap-4">
        <div className="opt d-flex flex-row gap-3 align-items-center">
            <img src={blockIcon}  alt="" />
            <p className='m-0'><b>Block {chatPerson.name}</b></p>
        </div>
        <div className="opt d-flex flex-row gap-3 align-items-center">
            <img src={muteIcon}  alt="" />
            <p className='m-0'><b>Mute {chatPerson.name}</b></p>
        </div>
        <div className="opt d-flex flex-row gap-3 align-items-center">
            <img src={dislikeIcon}  alt="" />
            <p className='m-0'><b>report {chatPerson.name}</b></p>
        </div>
    </div>
</div>

  )
}
export default ChatPersonProfile;