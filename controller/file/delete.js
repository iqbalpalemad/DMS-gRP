const   File                    = require('../../Model/File');
const   isValidToken            = require('../../utils/token');
const   { clearRedisCache }     = require('../../utils/redis');

const deleteFile = async (call,callback) => {
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

        const file = await File.findOne({_id : call.request.fileId}).cache();
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
                message  : "You don't have permission to delete this File"
            }
            return callback(null,response);
        }

        const deleteFile = await file.remove();
        response = {
            result   : true,
            message  : "File deleted succesfully",
            fileId   : file._id
        }
        clearRedisCache(File.collection.collectionName,file._id);
        return callback(null,response);

    }
    catch(err){
        const response = {
            result   : false,
            message  : err.message,
            fileId : ""
        }
        return callback(null,response);
    }
}

module.exports = deleteFile;