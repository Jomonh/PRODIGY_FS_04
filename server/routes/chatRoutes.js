const express=require('express')
//const userModel=require('../models/userModel')
const chatModel=require('../models/chatModel')
const msgModel=require('../models/messageModel')
const chatRouter=express.Router();
const {verifyToken}=require('../auth/userAuth')
//const deleteImage=require('../utils/handleDeleteImage')
const hideOrDeleteMsg=require('../utils/hideOrDeleteMsg')
chatRouter.post('/clear-chat',verifyToken,async(req,res,next)=>{
    const {userId,chatId}=req.body;
    if(userId===undefined||chatId===undefined)return res.send({status:400,msg:'Invalid access'})
    const msgArr=await msgModel.find({chatId:chatId,
        $or:[
            {hideUsers:{$elemMatch :{$ne:userId}}},
            {hideUsers:{$size:0}}        
        ]
    });
    const hideOrDeleteLogs=await hideOrDeleteMsg(msgArr,userId);
    console.log('hideOrDeleteLogs :'+hideOrDeleteLogs)
    hideOrDeleteLogs ? res.send({status:200,msg:'Chat cleared successfully !'})
        :res.send({status:300,msg:'Some errors occured in clearing the chats'})
})

module.exports=chatRouter;