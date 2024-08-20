import {useState} from 'react';
import app from '../firebase';
import { getDownloadURL, getStorage,ref, uploadBytes } from 'firebase/storage';
function ImageDemo() {
    const [uploading,setUploading]=useState(false)// i think it wont be used here
    const [imageUrl,setImageUrl]=useState('')
    async function handleChange(event){
        console.log(event.target.files[0]);
        const image=event.target.files[0];
        if(image){
            try{
                setUploading(true)
                const storage=getStorage(app)
                let iName=image.name
                let dotindex=(iName).lastIndexOf('.')
                let fileName=(iName).substring(0,dotindex).replace(/[ .()]+/g,'');
                let fileExt=(iName).substring(dotindex+1)
                let fileNamewithExt=`${fileName}_${Date.now()}.${fileExt}`
                console.log(fileNamewithExt);
                
                const storageRef=ref(storage,"images/profile"+fileNamewithExt);
                await uploadBytes(storageRef,image)
                const downloadUrl=await getDownloadURL(storageRef);
                console.log(downloadUrl);
                setImageUrl(downloadUrl) 
                //here write the code to upload it to db
                
                setUploading(false)      
            }catch(err){
                console.log('some error occured');
                console.log(err);
            }
        }
        
    }
    return (
    <div>
        
        <h2>Upload image</h2>
        <input type="file" name="" id="" onChange={handleChange} />
        <button disabled={uploading}>
            {uploading? "uploading" : "upload image"}
        </button>
        {imageUrl&& <img src={imageUrl} height={100} width={100} />}
    </div>
  )
}
export default  ImageDemo;