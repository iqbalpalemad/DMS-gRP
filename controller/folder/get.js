const   Folder       = require('../../Model/Folder');
const   isValidToken = require('../../utils/token');

const getFolder = async (call,callback) => {
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
                message  : "You don't have permission to view this folder"
            }
            return callback(null,response);
        }

        response = {
            result   : true,
            message  : "Folder fetch success"
        }

        folderData = {
            name : folder.name,
            userId : folder.userId,
            parentFolderId : folder.parentFolderId,
            createdAt : folder.createdAt.toString(),
            updatedAt : folder.updatedAt.toString()
        }

        response.folder = folderData;
        return callback(null,response);

    }
    catch(err){
        const response = {
            result   : false,
            message  : err.message
        }
        return callback(null,response);
    }
}

module.exports = getFolder