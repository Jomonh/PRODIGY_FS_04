const passport=require('passport');
const {Strategy} =require('passport-local')
const userModel=require('../models/userModel');
const {hashPassword,comparePassword}=require('../utils/securePassword')
passport.serializeUser((user,done)=>{
    console.log('insiide serialize user');
    console.log(user);
    done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    console.log('inside deserialize user');
    console.log(id);
    try{
        const user=await userModel.findById(id);
        if(!user) throw new Error('user not found')
        done(null,user);
    }catch(err){
        done(err,null)
        console.log('error caught');
    }
})

passport.use(new Strategy(async(email,passwd,done)=>{
    try{
        const user=await userModel.findOne({email});
        if(!user) throw new Error('User not found');
        if(!comparePassword(passwd,user.passwd)) throw new Error('Invalid credentials');
        done(null,user)
    }catch(err){
        done(err,null)
        console.log(err);
        
    }
}))

module.exports=passport;