const   User         = require('../../Model/User');
const   isValidToken = require('../../utils/token');


const getAll = async (call,callback) => {
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

        const users = await User.find();
        userReturn  = [];
        users.forEach(user => {
            userReturn.push({
                userId    : user._id,
                email     : user.email,
                createdAt : user.createdAt.toString(),
                updatedAt : user.updatedAt.toString()
            })
        });

        response = {
            result   : true,
            message  : "users fetched succesfully",
            user     : userReturn
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


module.exports = getAll;
