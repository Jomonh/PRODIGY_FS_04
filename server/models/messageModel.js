const mongoose=require('mongoose');

const MsgSchema=new mongoose.Schema({
    chatId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'chat'
    },
    senderId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'users'
    },
    data:{
        type:String,
        required:true,
    },
    isFileType:{
        type:Boolean,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true
    },
    hideUsers:{
        type:[String],
    }
})

const MsgModel=mongoose.model('messages',MsgSchema);

module.exports=MsgModel;