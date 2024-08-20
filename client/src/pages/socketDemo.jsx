import { useState } from "react";
import { io } from "socket.io-client";
import ChatDemo from "./chatDemo";
const SocketDemo=()=>{
    const socket=io.connect('http://localhost:3000')
    const [name,setName]=useState('')
    const [room ,setRoom]=useState('')

    const joinRoom=()=>{
        if(name!==''&&room!=''){
            socket.emit('join_room',room)
        }
    }

    return(
        <div>
            <h3>Join a chat</h3>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)}  placeholder="john..." />
            <input type="text" value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="room Id..." />
            <button onClick={joinRoom}>Join a Chat</button>

            <ChatDemo socket={socket} name={name} room={room}  />
        </div>
    )
}
export default SocketDemo;