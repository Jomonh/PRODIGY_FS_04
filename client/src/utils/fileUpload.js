import app from '../firebase';
import { getDownloadURL, getStorage,ref, uploadBytes } from 'firebase/storage';

async function uploadFile(file){
    //const [imageUrl,setImageUrl]=useState('')
    //async function handleChange(event){
        //console.log(event.target.files[0]);
        //const image=event.target.files[0];
        if(file && file!==''&&file!==null){
            try{
               // setUploading(true)
                const storage=getStorage(app)
                let iName=file.name
                let dotindex=(iName).lastIndexOf('.')
                let fileName=(iName).substring(0,dotindex).replace(/[ .()]+/g,'');
                let fileExt=(iName).substring(dotindex+1)
                let fileNamewithExt=`${fileName}_${Date.now()}.${fileExt}`
                console.log(fileNamewithExt);
                
                const storageRef=ref(storage,"images/profile"+fileNamewithExt);
                await uploadBytes(storageRef,file)
                const downloadUrl=await getDownloadURL(storageRef);
                console.log(downloadUrl);
                return downloadUrl;
                //write code where you call to send it to server

                // setImageUrl(downloadUrl)                 
                //setUploading(false)      
            }catch(err){
                console.log('some error occured');
                console.log(err);
            }
        }
    //}
}
export default uploadFile