const bcrypt                    = require('bcrypt');
const User                      = require('../../Model/User')




const createUser = async (call,callback) => {

    try{
        let userResponse = {};
        const existingUser = await User.findOne({email:call.request.email});
        if(existingUser){
            userResponse.result  = false,
            userResponse.message = "Email address already taken"
            return callback(null,userResponse);
        }
        const passwordHash = await bcrypt.hash(call.request.password,12);
        const user         = new User({
                email    : call.request.email,
                password : passwordHash
        });
        const save = await user.save();
        userResponse.result  = true,
        userResponse.message = save._id
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

module.exports = createUser;