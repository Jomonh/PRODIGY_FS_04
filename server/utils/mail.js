require('dotenv').config();
const nodemailer=require('nodemailer');
const mailPass=process.env.MAIL_SECRET;
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'vtaskapp@gmail.com',
        pass:mailPass
    }
})

async function sendOtp(data){
    const mailOptions={
        from:'vtaskapp@gmail.com',
        to:data.email,
        subject:'OTP for verification',
        html:`
            <div style={{
                display:'flex',flexDirection:'column',gap:'10px',padding:'5px'
                }}>
                <h3>Hello ${data.fname},</h3>
                <p>Please enter below OTP to <span style={{color:'yellow'}}>verify</span> your email ID with the Chat Application. It's valid for the next 2 minutes. </p>
                <h2><b>${data.otp}</b></h2>
                <p>Note: If you did not make this requirest,please ignore this email</p>
                <p style={{textAlign:'left',marginBottom:'0'}}>Thank you,</p>
                <p style={{textAlign:'left'}}>V Chat</p>
            </div>
        `
    }
    
    try{
        const info=await transporter.sendMail(mailOptions)
        console.log(info);
        return 'Success'
    }catch(err){
        console.log('got error');
        console.log(err);
        return err;
    }
}

async function sendResetLink(data){
    const mailOptions={
        from:'vtaskapp@gmail.com',
        to:data.to,
        subject:'Password reset link',
        html:`
            <div style={{
                display:'flex',flexDirection:'column',gap:'10px',padding:'5px'
                }}>
                <h3>Hello ${data.fname},</h3>
                <p>Please use below link  to <span style={}>Create new password </span> for  your email ID with the Chat  Application. It's valid for the next 5 minutes. </p>
                <a href='http://localhost:5173/reset-pass/${data.token}'>Click here </a>
                <p>Note: If you did not make this requirest,please ignore this email</p>
                <p style={{textAlign:'left',marginBottom:'0'}}>Thank you,</p>
                <p style={{textAlign:'left'}}>V Task</p>
            </div>
        `        
    }

    try{
        const info=await transporter.sendMail(mailOptions);
        console.log(info);
        return 'Success';
    }catch(err){
        console.log(err);
        return err;
    }
}

module.exports={sendOtp,sendResetLink}
/*const crypto=require('crypto')
let demo=crypto.randomBytes(32).toString('hex')
console.log(demo)
*/