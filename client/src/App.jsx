import { createContext, useEffect, useState } from 'react'
import './assets/css/App.css';
import LoginPage from './pages/loginPage';
import HomePage from './pages/homePage';
import ProfilePage from './pages/profilePage';
import EmojiDemo from './pages/EmojiDemo';
import ImageDemo from './pages/ImageDemo';
import SocketDemo from './pages/socketDemo';
import PasswordReset from './pages/passwordReset';
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom'

export const AppContext=createContext();
function App() {
  const [userData,setUserData]=useState({})
  const [isLoggedIn,setIsLoggedIn]=useState(()=>
    localStorage.getItem('isLoggedIn')==='true'
  )
  const [resetPass,setResetPass]=useState(()=> //true,null
    localStorage.getItem('resetPass')==='true'
  );

  console.log('userData is ');
  console.log(userData);
  console.log(localStorage.getItem('isLoggedIn'));
    
  function login(){
    console.log('user present');    
    setIsLoggedIn(true)
  }
  function logout(){
    console.log('user not present');
    setUserData({})
    setIsLoggedIn(false)
  }
  useEffect(()=>{
    if(isLoggedIn){
      console.log('the user is loggedin ');
      localStorage.setItem('isLoggedIn','true')
    }else{
      console.log('the user is not loggedin ');
      localStorage.removeItem('isLoggedIn')
    }
  },[isLoggedIn])

  
  useEffect(()=>{
    console.log('from useEffect 33'+resetPass);
    if(resetPass!==true) return localStorage.removeItem('resetPass');
    localStorage.setItem('resetPass',resetPass)
  },[resetPass])


  return (
    <>
      <AppContext.Provider value={{login,logout,isLoggedIn,userData,setUserData,resetPass,setResetPass}}>
        <BrowserRouter>
            <Routes>
              {isLoggedIn? 
                <>
                  <Route path='/home' element={<HomePage/>} />
                  <Route path='/profile' element={<ProfilePage/>} />
                  <Route path='/demo' element={<EmojiDemo/>}  />
                  <Route path='/demoda' element={<ImageDemo/>} />
                  <Route path='/socket' element={<SocketDemo/>} />
                  <Route path='*' element={<Navigate to='/home' />} />
                </> : <>
                {resetPass && <Route path='/reset-pass/:token' element={<PasswordReset/>} />}

                  <Route path='/' element={<LoginPage/>} />
                  <Route path='*' element={<Navigate to='/' />} />
                </>
              }
            </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </>
  )
}

export default App
