const   mongoose     = require('mongoose');
const   Folder       = require('../../Model/Folder');
const   isValidToken = require('../../utils/token');

const createFolder = async (call,callback) => {
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
        const folder = new Folder({
            name   : call.request.name,
            userId : mongoose.Types.ObjectId(validToken.userId),
            parentFolderId : mongoose.Types.ObjectId(call.request.parentFolderId)
        })
        const save = await folder.save();
        response = {
            result   : true,
            message  : "folder created succesfully",
            folderId : save._id
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


module.exports = createFolder;