const   mongoose                = require('mongoose');
const   Folder                  = require('../../Model/Folder');
const   isValidToken            = require('../../utils/token');
const   { clearRedisCache }     = require('../../utils/redis');

const moveFolder = async (call,callback) => {
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
        const folder = await Folder.findOne({_id : call.request.folderId}).cache();
        if(!folder){
            response = {
                result   : false,
                message  : "Folder not found"
            }
            return callback(null,response);
        }

        if(folder.userId != validToken.userId){
            response = {
                result   : false,
                message  : "You don't have permission to move this folder"
            }
            return callback(null,response);
        }

        if(call.request.parentFolderId == folder._id){
            response = {
                result   : false,
                message  : "Cannot move folder to the same folder"
            }
            return callback(null,response);
        }
        folder.parentFolderId = mongoose.Types.ObjectId(call.request.parentFolderId);
        const move = await folder.save();
        response = {
            result   : true,
            message  : "folder moved succesfully",
            folderId : move._id
        }
        clearRedisCache(Folder.collection.collectionName,move._id);
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



module.exports = moveFolder;