const   mongoose                = require('mongoose');
const   File                    = require('../../Model/File');
const   isValidToken            = require('../../utils/token');
const   { clearRedisCache }     = require('../../utils/redis');

const updateFile = async (call,callback) => {
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

        const file = await File.findOne({_id : call.request.fileId})
        if(!file){
            response = {
                result   : false,
                message  : "Folder not found"
            }
            return callback(null,response);
        }

        if(file.userId != validToken.userId){
            response = {
                result   : false,
                message  : "You don't have permission to update this file"
            }
            return callback(null,response);
        }

        if(call.request.parentFolderId !== ""){
            file.parentFolderId = mongoose.Types.ObjectId(call.request.parentFolderId);
        }

        if(call.request.name !== ""){
            file.name = call.request.name;
        }

        if(call.request.content !== ""){
            file.content = call.request.content;
        }

        const update = await file.save();
        response = {
            result   : true,
            message  : "file updated succesfully",
            fileId   : update._id
        }
        clearRedisCache(File.collection.collectionName,update._id);
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

module.exports = updateFile;