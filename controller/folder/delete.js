const   Folder                  = require('../../Model/Folder');
const   isValidToken            = require('../../utils/token');
const   { clearRedisCache }     = require('../../utils/redis');

const deleteFolder = async (call,callback) => {
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

        const folder = await Folder.findOne({_id : call.request.folderId})
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
                message  : "You don't have permission to delete this folder"
            }
            return callback(null,response);
        }

        const deleteFolder = await folder.remove();
        response = {
            result   : true,
            message  : "folder deleted succesfully",
            folderId : folder._id
        }
        clearRedisCache(Folder.collection.collectionName,folder._id);
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

module.exports = deleteFolder;