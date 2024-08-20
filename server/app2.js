const express=require('express');
const http=require('http');
//const mongoose=require('mongoose');
const cors=require('cors')
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser')
const app=express();
const {Server}=require('socket.io')
//mongoose.connect('mongodb://127.0.0.1:27017/chatDemo')

app.use(cors({
    methods:['GET','POST'],
    credentials:true,
    origin:'http://localhost:5173'
}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

const server=http.createServer(app)

const io=new Server(server,{cors:{
    methods:['GET','POST'],
    credentials:true,
    origin:'http://localhost:5173'
}})

io.on('connection',(socket)=>{
    console.log('user connected '+socket.id);

    socket.on('join_room',(data)=>{
        socket.join(data)
        console.log(`user with id : ${socket.id} joined room ${data}`)
    })

    socket.on('send_msg',(data)=>{
        //console.log(data)
        socket.to(data.room).emit('recv_msg',data)
    })

    socket.on('disconnect',()=>{
        console.log('user disconnected')
    })
})

server.listen(3000,()=>{
    console.log('Chat demo is running on port 3000');
})
