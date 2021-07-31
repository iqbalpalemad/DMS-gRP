const jwt                           = require('jsonwebtoken');
const bcrypt                        = require('bcrypt');
const User                          = require('../../Model/User')

const login = async (call,callback) => {
    try{
        let response = {};
        const user = await User.findOne({email:call.request.email});
        if(!user){
            response.result  = false,
            response.message = "Email address not found"
            return callback(null,response);
        }

        const passwordMatch = await bcrypt.compare(call.request.password,user.password);
        if(!passwordMatch){
            response.result  = false,
            response.message = "Password doesn't match"
            return callback(null,response);
        }

        const jwtSecret = process.env.JWT_SECRET;
        const jwtToken  = jwt.sign({id:user._id},jwtSecret,{expiresIn:'1d'})
        response.result  = true,
        response.message = jwtToken
        return callback(null,response);
    }
    catch(err){
        const response = {
            result  : false,
            message : err.message
        }
        return callback(null,response);
    }
}

module.exports = login;