import { useEffect, useState } from 'react'

// eslint-disable-next-line react/prop-types
function ChatDemo({socket,name,room}) {
    const [currentMsg,setCurrentMsg]=useState('')

    async function sendMsg(){
        if(currentMsg!==''){
            const msgData={
                room:room,
                sender:name,
                msg:currentMsg,
                time:new Date(Date.now()).getHours() +" : "+new Date(Date.now()).getMinutes()
            }
            // eslint-disable-next-line react/prop-types
            await socket.emit("send_msg",msgData)
        }
    }
    useEffect(()=>{
        // eslint-disable-next-line react/prop-types
        socket.on("recv_msg",(data)=>{
            console.log(data)
        })
    },[socket])

    return (
    <div>
        <div className="chat-header">
            <p>Live chat</p>
        </div>
        <div className="chat-body">
            
        </div>
        <div className="chat-foot">
            <input type="text" placeholder='Hey...' value={currentMsg} onChange={(e)=>setCurrentMsg(e.target.value)} />
            <button onClick={sendMsg}>Send</button>
        </div>
    </div>
  )
}
export default ChatDemo;