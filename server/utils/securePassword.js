const bcrypt=require('bcrypt');

const saltRounds=10;

function hashPassword(password){
    const salt=bcrypt.genSaltSync(saltRounds);
    const hash=bcrypt.hashSync(password,salt)
    console.log(hash);
    return hash;
}

function comparePassword(password,hash){
    const isValid=bcrypt.compareSync(password,hash);
    console.log(isValid)
    return isValid;
}

module.exports={hashPassword,comparePassword};