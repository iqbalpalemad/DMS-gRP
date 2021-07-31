const jwt   = require('jsonwebtoken');
const User  = require("../Model/User");

const isValidToken = async (token) => {
    try{
        const jwtSecret   = process.env.JWT_SECRET;
        const decoded     = await jwt.verify(token,jwtSecret);
        const user        = await User.findById(decoded.id);
        if(!user){
            return {valid : false}
        }
        return {valid : true, userId : decoded.id}
        
    }
    catch(err){
        return {valid : false}
    }
    
}

module.exports = isValidToken;