const bcrypt                    = require('bcrypt');
const User                      = require('../../Model/User')




const createUser = async (call,callback) => {

    try{
        const passwordHash = await bcrypt.hash(call.request.password,12);
        const user         = new User({
                email    : call.request.email,
                password : passwordHash
        });
        const save = await user.save();
        const userResponse = {
            result  : true,
            message : save._id
        }
        callback(null,userResponse);
    }
    catch(err){
        console.log(err)
        const userResponse = {
            result  : false,
            message : err.message
        }
        callback(null,userResponse);
    }
}

module.exports = createUser;