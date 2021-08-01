const   mongoose     = require('mongoose');
const   User         = require('../../Model/User');
const   isValidToken = require('../../utils/token');

const deleteUser = async (call,callback) => {
    try{
        const validToken = await isValidToken(call.request.token);
        let   response    = {};
        if(!validToken.valid){
            response = {
                result   : false,
                message  : "Authorization Failed"
            }
            return callback(null,response);
        }

        if(!mongoose.isValidObjectId(call.request.userId)){
            response = {
                result   : false,
                message  : "Invalid user ID"
            }
            return callback(null,response);
        }

        const user = await User.findOne({_id : call.request.userId})
        if(!user){
            response = {
                result   : false,
                message  : "User not found"
            }
            return callback(null,response);
        }
        const deleteUser = await user.remove();
        response = {
            result   : true,
            message  : "user deleted succesfully"
        }
        return callback(null,response);

    }
    catch(err){
        const response = {
            result   : false,
            message  : err.message,
            folderId : ""
        }
        return callback(null,response);
    }
}

module.exports = deleteUser;