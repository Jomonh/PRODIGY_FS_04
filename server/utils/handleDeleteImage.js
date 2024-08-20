const admin=require('./firebase');
//gs://chat-app-image.appspot.com
const bucket=admin.storage().bucket('gs://chat-app-image.appspot.com');
async function deleteImage(imgUrl){//gs://chat-app-image.appspot.com/images/profilesend (1).png
    try{//https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2Fprofileblock_1723707993280.png?alt=media&token=eef3f36d-b2ec-4dc3-b247-49c3cf1598c7
        const path = decodeURIComponent(imgUrl.split('chat-app-image.appspot.com/o/')[1].split('?')[0]) 
        console.log(path)
        const file=bucket.file(path)
        await file.delete()
        return true;    
    }catch(err){
        console.log(err)
        return false
    }
}

module.exports=deleteImage;