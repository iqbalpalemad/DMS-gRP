const jwt                           = require('jsonwebtoken');
const bcrypt                        = require('bcrypt');
const User                          = require('../../Model/User')

const login = async (call,callback) => {
    try{
        let userResponse = {};
        const user = await User.findOne({email:call.request.email});
        if(!user){
            userResponse.result  = false,
            userResponse.message = "Email address not found"
            return callback(null,userResponse);
        }

        const passwordMatch = await bcrypt.compare(call.request.password,user.password);
        if(!passwordMatch){
            userResponse.result  = false,
            userResponse.message = "Password doesn't match"
            return callback(null,userResponse);
        }

        const jwtSecret = process.env.JWT_SECRET;
        const jwtToken  = jwt.sign({id:user._id},jwtSecret,{expiresIn:'1d'})
        userResponse.result  = true,
        userResponse.message = jwtToken
        return callback(null,userResponse);
    }
    catch(err){
        const userResponse = {
            result  : false,
            message : err.message
        }
        return callback(null,userResponse);
    }
}

module.exports = login;