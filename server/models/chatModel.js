const mongoose=require('mongoose');

const chatSchema= new mongoose.Schema({
    participants:[{
         type:mongoose.Schema.Types.ObjectId,
         required:true,
         ref:'users'
        }],
    createdAt:{
        type:Date,
        default:new Date(),
    },
    lastMsg:{
        type:String,
    },
    lastMsgType:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

chatSchema.pre('save',(next)=>{
    this.updatedAt=Date.now;
    next();
})

const chatModel=mongoose.model('chat',chatSchema,'chats');

module.exports=chatModel;