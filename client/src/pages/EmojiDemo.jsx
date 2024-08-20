import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import addIcon from '../assets/images/add.svg'
const EmojiDemo = () => {
  const [inputValue, setInputValue] = useState('');
  const [showEmoji, setshowEmoji] = useState(false);
  const [fileVal,setFileVal]=useState(null)

  function handleFileChange(event){
    console.log(event);
    
    setFileVal(event.target.files[0])
  }

  function handleEmoji(event){
    console.log(event);
    setInputValue((prev)=> (prev+event.emoji))
    console.log(event.emoji);
    console.log(inputValue);
  }

  return (
    <div>
        <input type="text" name="" id="" value={inputValue} onChange={(event)=>setInputValue(event.target.value)} />
        <EmojiPicker onEmojiClick={handleEmoji} />
        <p>{inputValue}</p>
        <hr />
        <label htmlFor="fileInput" >
            <img src={addIcon} height={30} width={30} style={{
                backgroundColor:'skyblue',
                borderRadius:'50%',
                padding:'2px'
            }} alt="" />
        </label>
        <input type="file" name="" id="fileInput" multiple max={3} style={{display:'none'}}  onChange={handleFileChange} />
        {fileVal && <p>Selected input value is {fileVal.name} </p> }
    </div>
  );
};

export default EmojiDemo;
/*

 <div>
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="Type something with emojis 😊" 
      />
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        {showEmojiPicker ? 'Close Emoji Picker' : 'Open Emoji Picker'}
      </button>
      {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
      <p>Output: {inputValue}</p>
    </div>
*/