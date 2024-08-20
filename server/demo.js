/*
const str='viki hacky'
console.log(str[0])
//let varible=parseInt()

var reverse = function(x) {
    let y= String(x)
    let z=''
    for(var i=0;i<y.length;i++){
        z+=y[i]
    }
    console.log('z value is '+z)
    let a= parseInt(z)
    return a
};

console.log(reverse(36459))
*/
/*
const crypto=require('crypto')
let secret=crypto.randomBytes(32).toString('hex')
console.log(secret)
*/

const isoDateString = "2024-08-08T19:32:00.000+00:00"; // UTC time
const utcDate = new Date(isoDateString); // Parse the ISO date

// Correct for local time by subtracting the time zone offset
const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

console.log(localDate.toString()); // Outputs the correct local time in your time zone
console.log(localDate.getHours())
const messages=[
    {
      _id: '66b8bfd5b907d692b6f7b98a',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'hi dude !',
      isFileType: false,
      createdAt: '2024-08-11T13:42:45.445Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66b8c53c69d5e26782a6525b',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b447b11862a3bf66ae9f42',
      data: 'are you mad there are lot more stuffs to do,including ui',
      isFileType: false,
      createdAt: '2024-08-11T14:05:48.971Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bcb7a6d345974dbfb31a77',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'har har mahadev !!',
      isFileType: false,
      createdAt: '2024-08-14T13:56:54.136Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bcba63d345974dbfb31a94',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'god, will it work ?',
      isFileType: false,
      createdAt: '2024-08-14T14:08:35.592Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bcc2c1d345974dbfb31ad4',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b447b11862a3bf66ae9f42',
      data: 'Dei Vignesh',
      isFileType: false,
      createdAt: '2024-08-14T14:44:17.031Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bcc939d345974dbfb31b10',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'hi dude',
      isFileType: false,
      createdAt: '2024-08-14T15:11:53.916Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bdb0229a025b9a355c56ab',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2Fprofiledont-like_1723707421716.png?alt=media&token=a2463331-a89e-44ef-818b-5915e22e961c',
      isFileType: true,
      createdAt: '2024-08-15T07:37:06.545Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bdb1219a025b9a355c56bd',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'hi',
      isFileType: false,
      createdAt: '2024-08-15T07:41:21.944Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66be0e29eef3935e113db8dd',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b447b11862a3bf66ae9f42',
      data: 'https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2FprofileIMG-20220716-WA0009_1723731493234.jpg?alt=media&token=a1bb2c77-7576-43b7-ad72-9d2c05f98567',
      isFileType: true,
      createdAt: '2024-08-15T14:18:17.099Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bf377e0482a730a3432db5',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b447b11862a3bf66ae9f42',
      data: 'lets check',
      isFileType: false,
      createdAt: '2024-08-16T11:26:54.104Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf378d0482a730a3432db7',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b447b11862a3bf66ae9f42',
      data: 'how well is it responsive',
      isFileType: false,
      createdAt: '2024-08-16T11:27:09.206Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf37a60482a730a3432dbb',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'just 2 more msg',
      isFileType: false,
      createdAt: '2024-08-16T11:27:34.361Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf37ab0482a730a3432dbd',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'oh',
      isFileType: false,
      createdAt: '2024-08-16T11:27:39.907Z',
      hideUsers: [ '66b43ae41862a3bf66ae9f3d' ],
      __v: 0
    },
    {
      _id: '66bf57d08c08c3139b2c100d',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2FprofileIMG-20240812-WA0003_1723815883939.jpg?alt=media&token=3107924c-3736-4e07-a7ca-077f13e57ecf',
      isFileType: true,
      createdAt: '2024-08-16T13:44:48.282Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf57e98c08c3139b2c100f',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2Fprofileto-do-list_1723815911853.png?alt=media&token=07cfd273-f121-4671-96f2-2f5f8c8b4920',
      isFileType: true,
      createdAt: '2024-08-16T13:45:13.474Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf59ee8c08c3139b2c1015',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2Fprofilehome1_1723816429299.png?alt=media&token=172743b9-43ad-4452-89d8-f14aa3cb8d0d',
      isFileType: true,
      createdAt: '2024-08-16T13:53:50.668Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf5a068c08c3139b2c1017',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'https://firebasestorage.googleapis.com/v0/b/chat-app-image.appspot.com/o/images%2Fprofileto-do-list5_1723816452349.png?alt=media&token=43d44055-3139-43b3-87ce-f01e4467e951',
      isFileType: true,
      createdAt: '2024-08-16T13:54:14.008Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66bf87ef3ab627b96f0677d8',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'hi',
      isFileType: false,
      createdAt: '2024-08-16T17:10:07.148Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66c155e5184b265afe68f8e2',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b447b11862a3bf66ae9f42',
      data: 'yes i think',
      isFileType: false,
      createdAt: '2024-08-18T02:01:09.876Z',
      hideUsers: [],
      __v: 0
    },
    {
      _id: '66c155ed184b265afe68f8e4',
      chatId: '66b8bfc8b907d692b6f7b983',
      senderId: '66b43ae41862a3bf66ae9f3d',
      data: 'rightu',
      isFileType: false,
      createdAt: '2024-08-18T02:01:17.197Z',
      hideUsers: [],
      __v: 0
    }
  ]
    //here message is similar to arr.map(elem)
const groupedMessages = messages.reduce((acc, message) => {
    const date = new Date(message.createdAt);
    const messageDate = date.toLocaleDateString(); // Converts to local date string (e.g., "8/18/2024")
  
    if (!acc[messageDate]) {
      acc[messageDate] = [];
    }
  
    acc[messageDate].push(message);
  
    return acc;
  }, {});
  console.log(groupedMessages)

/*
            <div className="oneDay  d-flex flex-column gap-2" onClick={()=>setChatOpt(false)} >
                <div className="text-center">{msgArr.length}Today {chatId}</div>
                {msgArr.map((msg,index)=>{
                    //console.log('---------------')
                    //console.log(msg.senderId)
                    //console.log(userData._id)
                    //console.log(msg.senderId===userData._id)
                    let time=new Date(msg.createdAt).getHours()+':'+new Date(msg.createdAt).getMinutes()
                    return(
                        <div id={index} className={`d-flex flex-row px-3 py-1 ${msg.senderId===userData._id? 'justify-content-end':'justify-content-start'}` } key={index} 
                           // onMouseDown={()=>setTimeout(handleLongPress(index),500)} 
                           // onMouseUp={()=>clearTimeout()}
                            onClick={()=>handleClick(index)} style={selectedChats.includes(index)?{backgroundColor:'#2e7eaebd'}:{}} 
                        >   
                            <div  className={`chatDiv  p-1 ${msg.senderId===userData._id ? ' bg-success':'  bg-light'}` }>
                                {msg.isFileType? <img src={msg.data} className='imgMsg' /> : <p>{msg.data}</p> }
                                <span className=''>{time}</span>
                            </div>
                        </div>)
                })
                }
            </div>


*/