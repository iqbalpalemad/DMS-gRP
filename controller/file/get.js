const   File         = require('../../Model/File');
const   isValidToken = require('../../utils/token');

const getFile = async (call,callback) => {
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
                message  : "File not found"
            }
            return callback(null,response);
        }

        if(file.userId != validToken.userId){
            response = {
                result   : false,
                message  : "You don't have permission to view this File"
            }
            return callback(null,response);
        }

        response = {
            result   : true,
            message  : "File fetch success"
        }

        fileData = {
            name : file.name,
            userId : file.userId,
            content : file.content,
            parentFolderId : file.parentFolderId,
            createdAt : file.createdAt.toString(),
            updatedAt : file.updatedAt.toString()
        }

        response.file = fileData;
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

module.exports = getFile