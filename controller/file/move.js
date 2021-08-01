const   mongoose     = require('mongoose');
const   File         = require('../../Model/File');
const   isValidToken = require('../../utils/token');

const moveFile = async (call,callback) => {
    try{
        const validToken = await isValidToken(call.request.token);
        let   response   = {};
        if(!validToken.valid){
            response = {
                result   : false,
                message  : "Authorization Failed"
            }
            return callback(null,response);
        }
        const file = await File.findOne({_id : call.request.fileId})
        if(!file){
            response = {
                result   : false,
                message  : "File not found"
            }
            return callback(null,response);
        }

        if(file.userId != validToken.userId){
            response = {
                result   : false,
                message  : "You don't have permission to move this file"
            }
            return callback(null,response);
        }
        file.parentFolderId = mongoose.Types.ObjectId(call.request.parentFolderId);
        const move = await file.save();
        response = {
            result   : true,
            message  : "file moved succesfully",
            fileId   : move._id
        }
        return callback(null,response);

    }
    catch(err){
        const response = {
            result   : false,
            message  : err.message,
            fileId   : ""
        }
        return callback(null,response);
    }
}



module.exports = moveFile;