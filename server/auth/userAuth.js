const jwt=require('jsonwebtoken');
//const userModel=require('../models/userModel')

function renewToken(req,res,next){
    let response={};
    let  exist=false
    const {refreshToken}=req.cookies;
    if(!refreshToken){
        response={status:405,msg:'User not Authentic!'}
    }else{//generate accessToken from refreshToken
        jwt.verify(refreshToken,process.env.REFRESH_SECRET,(err,decoded)=>{
            if(err) return res.send({status:404,msg:'Invalid refresh token'})
            //const email=decoded.email;
            const accessToken=jwt.sign({email:decoded.email},process.env.ACCESS_SECRET,
                {expiresIn:'1m'})
            req.email=decoded.email;
            exist=true;
            response={msg:'Access token generated successfully'};
            res.cookie('accessToken',accessToken,{
                maxAge:'300000',httpOnly:true,sameSite:'none',secure:true
            })
        })       
    }
    return {response,exist}
}

function verifyToken(req,res,next){
    console.log('enere verifytoekn')
    const {accessToken,refreshToken}=req.cookies;
    console.log(req.cookies);
    if(accessToken){
        jwt.verify(accessToken,process.env.ACCESS_SECRET,(err,decoded)=>{
            if(err) return res.send({status:404,msg:'Invalid access token'})
            //valid token
            console.log('valid access token'+decoded.email);
            req.email=decoded.email;
            next();
        })
    }else{
        const {response,exist}=renewToken(req,res,next);
        console.log(response)
        console.log('is exist : '+exist)
        if(!exist)return res.send(response);
        next();
    }
}


function forgotAuth(req,res,next){
    //        req.session.resetData={token:token,email:email};
    console.log('entered authForgot');
    const passwd=req.body.passwd;
    console.log(passwd);

    //const resetData=req.session.resetData;
    const {resetData}=req.cookies;
    console.log(resetData);
    if(resetData&& resetData!==undefined){
        jwt.verify(resetData,process.env.RESET_SECRET,(err,decoded)=>{
            if(err) return res.send({status:404,msg:'Invalid access token'})
            //valid token
            console.log('valid access token : '+decoded.email);
            console.log(decoded.token)
            req.resetData={email:decoded.email,token:decoded.token}
            next();
        })
    }else{
        console.log('entered else')
        res.send({status:400,msg:'Session expired please send a new request for forgot password'})
    }
}



module.exports={verifyToken,forgotAuth};