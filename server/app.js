require('dotenv').config()
const express=require('express');
//const expressSession =require('express-session');
//const passport=require('passport')
//const MongoStore=require('connect-mongo');
const mongoose=require('mongoose');
const {Server}=require('socket.io')
const cors=require('cors')
const socketCookieParser=require('socket.io-cookie-parser')
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser')
const http=require('http');
const jwt=require('jsonwebtoken')
const deleteImage=require('./utils/handleDeleteImage')
const app=express();
mongoose.connect('mongodb://127.0.0.1:27017/chatApplication')
const chatModel=require('./models/chatModel')
const msgModel=require('./models/messageModel')
const hideOrDeleteMsg=require('./utils/hideOrDeleteMsg')
require('./strategies/localStrategy');//importing localstrategy
app.use(cors({
    methods:['GET','POST'],
    credentials:true,
    origin:'http://localhost:5173'
}))

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/',require('./routes/userRoutes'))
app.use('/',require('./routes/forgotRoutes'))
app.use('/',require('./routes/chatRoutes'))

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        methods:['GET','POST'],
        credentials:true,
        origin:'http://localhost:5173'    
    }
})
io.use(socketCookieParser())

io.use((socket,next)=>{
    const {accessToken,refreshToken}=socket.request.cookies
    console.log('socket token is ')
    console.log(socket.request.cookies)
   if(accessToken||refreshToken){
   // socket.emit('auth_err', { msg: 'Test auth error' });  // Test emission
    next();
   }else{
    console.log('invalid')
    socket.emit('auth_err',{msg:'both access and refresh token not present'})
    console.log('sending error msg in socket')
   }
})
/*
1.create a unique room for each user to load the necessary msg data history
2.create a room with 2 users for enabling msg updates

*/
async function getMsgData(socket,dbData,sender){//here only need to implement unique room
    const id=dbData._id;
    console.log(id)
    console.log('from  getMsgData')
    console.log(sender)
    const msgArr=await msgModel.find({chatId:id,
        $or:[
            {hideUsers:{$elemMatch :{$ne:sender}}},
            {hideUsers:{$size:0}}        
        ]
    })
    console.log('msgArr is ');
    console.log(msgArr);
    socket.join(sender)
    await socket.join(id.toString())  

    console.log(`user with id ${socket.id} joined`)
    io.to(sender).emit('recv_msgList',{arr:msgArr,chatId:id})
}

io.on('connection',(socket)=>{

    socket.on('delete_for_me',async(data)=>{//here not only need to upload 
        console.log('delete for me ')
        const {sender,msgIdArr}=data;
        const msgArr=await msgModel.find({_id: {$in:msgIdArr}},{hideUsers:1,isFileType:1,data:1})
        const hideOrDeleteLogs=await hideOrDeleteMsg(msgArr,sender);
        console.log('hideOrDeleteLogs :'+hideOrDeleteLogs)
    })

    socket.on('delete_msg',async(data)=>{//delete from db, and change the data to both users
        console.log('delete for everyOne')
        const {arr,chatId,fileDataArr,sender}=data
        console.log(data)
        const remainingMsg=await msgModel.deleteMany({
          $and:[  {_id: {$in:arr}} ,{senderId:sender}]
        })//why cant we send array of these msgId which are deleted and remove it from frontend
        console.log(remainingMsg)
        io.in(chatId).emit('handle_delete_all',arr)
        console.log(arr)

        fileDataArr.forEach(async(dataUrl)=>{
            console.log('from delete for all, firebase delte img')
            const firebaseLogs=await deleteImage(dataUrl)
            console.log('is files delted successfully ')
            console.log(firebaseLogs)
            //https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2Fprofileblock_1723707993280.png?alt=media&token=eef3f36d-b2ec-4dc3-b247-49c3cf1598c7
        })
        //logic to check whether the msg are of type file and delete them firebase
        /*
        arr.forEach(async(msg)=>{
            if(msg.isFileType){

            }
        })
        */

    })

    socket.on('edit_msg',async(data)=>{
        console.log('edit ')
        console.log(data)
        const {msgId,msgValue,chatId}=data;
        msgModel.findOneAndUpdate({_id:msgId},{
          $set:{data:msgValue}  
        },{new:true}).then((updatedData)=>{
            console.log(updatedData)
            io.in(chatId).emit('recv_edit_msg',updatedData)
        })
    })

    socket.on('create_private_room',async(data)=>{
        console.log('create_private_room data on socket is ')
        const {sender}=data;
        const chatData=await chatModel.findOne({
           participants:{$eq:[sender]}
        })
        console.log(chatData)
        if(chatData===null){
            chatModel.create({ participants:[sender],createdAt:new Date(),lastMsg:'' })
            .then(async (dbData)=>{
                console.log('creating a new private chat data ');
                getMsgData(socket,dbData,sender)
            }).catch(err=>{
                console.log('err')
                console.log(err)
            })
        }else{
            console.log('private chat data already exist')
            getMsgData(socket,chatData,sender)
        }
    })
    socket.on('create_room',async(data)=>{//senderid, receiverid, room
        console.log('create_room,data on socket is ')
        console.log(data);
        const {sender,recvr}=data;
        console.log('sender id is '+sender)
        console.log('recvr id is '+recvr)
        const chatData=await chatModel.findOne({
            participants:{'$all': [sender,recvr] },
       //     participants:{'$size':2}
        })
        console.log(chatData);
        if(chatData===null){
            chatModel.create({ participants:[sender,recvr],createdAt:new Date(),lastMsg:'' })
            .then(async (dbData)=>{
                console.log('creating a new chat data ');
                getMsgData(socket,dbData,sender)
            }).catch(err=>{
                console.log('err')
                console.log(err)
            })
        }else{
            console.log('chat data already exist')
            getMsgData(socket,chatData,sender)
        }
    })    

    socket.on('createNotifyRoom',(data)=>{
        socket.join(data)//this will create a seperate room for each user
    })

    socket.on('send_msg',async(Sdata)=>{
        const {sender,recvr,msgData,name}=Sdata;
        console.log('in send_msg');
        console.log(Sdata)
        console.log('response send')
        msgModel.create(msgData).then(async(data)=>{
            console.log('data inserted')//console.log(data)
            //.in(recvr)
            //if(sender!==recvr){
                io.to(recvr).emit('recvNotify',{msg:data.data,name:name,sender:sender,recvr:recvr,lastMsgType:data.isFileType})
                io.to(sender).emit('recvNotify',{msg:data.data,name:name,sender:sender,recvr:recvr,lastMsgType:data.isFileType})
           // }
            io.in(Sdata.msgData.chatId).emit('recv_msg',data)
           // io.in(Sdata.msgData.chatId).emit('recv_lastMsg',{data:data.data,user1:sender,user2:recvr})
            await chatModel.updateOne({_id:Sdata.msgData.chatId},{lastMsg:data.data,lastMsgType:data.isFileType})
            // io.in(msgData.chatId).emit('recv_msg',msgData)
        })  
    })
    socket.on('disconnect',()=>{
        console.log('user disconnected')
    })
    //socket.emit('create_chat',{sender:userData._id,recvr:chatPerson._id})
})

server.listen(3000,()=>{
    console.log('Chat app is running on port 3000');
})

/*
app.use(expressSession({
    secret:'4024701ff8958f7f87ca92f2a3f6db3548141645a25c183f91e4c9670a108e65',
    saveUninitialized:false,
    resave:false,
    cookie:{
        httpOnly:true,
        secure:true,
        sameSite:'none'
    },
    store:MongoStore.create({
        client:mongoose.connection.getClient(),
    }) 
}))
app.use(passport.initialize())
app.use(passport.session())
*/

    /*
    socket.on('create_chat',(Sdata)=>{
        console.log(Sdata)
        const {sender,recvr,data,isFile,time}=Sdata;
        const chatData=await chatModel.findOne({paricipants:[sender,recvr]})
        console.log(chatData);
        if(chatData!==null){
            console.log('some issues')
        }else{
            chatModel.create({
                paricipants:[sender,recvr],
                lastMsg:data
            }).then(insertData=>{
                console.log(insertData);
                msgModel.create({
                    senderId:sender,chatId:insertData._id,data:data,isFileType:isFile,createdAt:time
                }).then(msgData=>{
                    console.log(msgData);
                    socket.to(Sdata).emit('recv_msg',msgData)
                })
            })
            //const chatData2=await chatModel.findOne({ paricipants:[sender,recvr] })
        }  
    })
*/
/*
        //1. already a entry present in chat colltn, get all msg with that chat
        //2. create entry in chat collectn

*/
/*

        /*
        await socket.join(chatData._id)
        let id=(chatData._id).toString()
        console.log(socket.id)
        console.log(typeof id);
        
        console.log('hiii') //,{chatData:'chatData',arr:dummy}
         socket.emit('recv_msgList',chatData )
        console.log('hiii')

       // console.log(data);
       // socket.join(data);                 socket.to(id).emit('recv_msgList',{arr:msgArr,chatId:id})

        //console.log(`user with id ${socket.id} joined`)
*/
  /*
        console.log(Sdata);
        const {sender,recvr,data,isFile,time}=Sdata;
        const chatData=await chatModel.findOne({participants:[sender,recvr]})
        console.log(chatData);
        if(chatData===null) return console.log('problem ')
        msgModel.create({
            senderId:sender,chatId:insertData._id,data:data,isFileType:isFile,createdAt:time
        }).then(msgData=>{
            console.log(msgData);
            socket.to(Sdata).emit('recv_msg',msgData)
        })
        */
        /*
                let deleteIdArr=[]
        let hideIdArr=[]
        let deleteImgUrl=[]
        await msgArr.map((msg)=>{
            if(msg.hideUsers.length>0){//add to delete arr
                deleteIdArr.push(msg._id)
                if(msg.isFileType){//addimg img urls needed to be deleted
                    console.log(msg.data)
                    deleteImgUrl.push(msg.data)
                }    
            }else{
                hideIdArr.push(msg._id)
            }
        })
        console.log(data)
        // write logic to check whether the msg are of type file and delete them firebase
        const deletedMsg=await msgModel.deleteMany({_id:{$in:deleteIdArr}})
        console.log(deletedMsg);
        const hidedMsg=await msgModel.updateMany({_id:{$in:hideIdArr}},{
            $push: {hideUsers: sender}
        })
        console.log(hidedMsg)
        deleteImgUrl.forEach(async(url)=>{
            const firebaseLogs=await deleteImage(url)
            console.log(firebaseLogs);
        })

        */
    