const msgModel=require('../models/messageModel')
const deleteImage=require('./handleDeleteImage')
async function hideOrDeleteMsg(msgArr,sender){
    let deleteIdArr=[]
    let hideIdArr=[]
    let deleteImgUrl=[]
    try{
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
        //console.log(data)// write logic to check whether the msg are of type file and delete them firebase
        const deletedMsg=await msgModel.deleteMany({_id:{$in:deleteIdArr}})
        console.log(deletedMsg);
        const hidedMsg=await msgModel.updateMany({_id:{$in:hideIdArr}},{
            $push: {hideUsers: sender}
        })
        console.log(hidedMsg)
        deleteImgUrl.forEach(async(url)=>{//this is used to delete the images from firbase
            const firebaseLogs=await deleteImage(url)
            console.log(firebaseLogs);
        })
        return true;
    }catch(err){
        console.log(err);
        return false
    }
}

module.exports=hideOrDeleteMsg;