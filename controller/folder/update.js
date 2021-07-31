const   mongoose     = require('mongoose');
const   Folder       = require('../../Model/Folder');
const   isValidToken = require('../../utils/token');

const updateFolder = async (call,callback) => {
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
                message  : "You don't have permission to update this folder"
            }
            return callback(null,response);
        }

        if(call.request.parentFolderId !== ""){
            folder.parentFolderId = mongoose.Types.ObjectId(call.request.parentFolderId);
        }

        if(call.request.name !== ""){
            folder.name = call.request.name;
        }

        const update = await folder.save();
        response = {
            result   : true,
            message  : "folder updated succesfully",
            folderId : update._id
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


module.exports = updateFolder;