const   mongoose     = require('mongoose');
const   Folder       = require('../../Model/Folder');
const   File         = require('../../Model/File');
const   isValidToken = require('../../utils/token');

const getFolderContent = async (call,callback) => {
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
        const folder = await Folder.findOne({_id : call.request.folderId,userId :validToken.userId})
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
        let folders;
        let files;
        const  foldersReturn = [];
        const  filesReturn = [];
        if(call.request.type == "all" || call.request.type == "folder"){
            folders = await Folder.find({parentFolderId : mongoose.Types.ObjectId(call.request.folderId), userId :validToken.userId })
            folders.forEach(element => {
                folderItem = {
                    name : element.name,
                    userId : element.userId,
                    createdAt : element.createdAt.toString(),
                    updatedAt : element.updatedAt.toString()
                };
                if(element.parentFolderId){
                    folderItem["parentFolderId"] = element.parentFolderId;
                }
                foldersReturn.push(folderItem);
                
            });
        }
        if(call.request.type == "all" || call.request.type == "file"){
            files   = await File.find({parentFolderId   : mongoose.Types.ObjectId(call.request.folderId), userId : validToken.userId})
            files.forEach(element => {
                fileItem = {
                    name : element.name,
                    userId : element.userId,
                    createdAt : element.createdAt.toString(),
                    updatedAt : element.updatedAt.toString()
                };
                if(element.parentFolderId){
                    fileItem["parentFolderId"] =  element.parentFolderId;
                }
                if(element.content){
                    fileItem["content"] = element.content;
                }
                filesReturn.push(fileItem)
            });
        }
        
        
        
        
        response = {
            result   : true,
            message  : "Folder Content fetch success"
        }

        if(call.request.type == "all" || call.request.type == "folder"){
            response.folders = foldersReturn;
        }
        if(call.request.type == "all" || call.request.type == "file"){
            response.files = filesReturn;
        }

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


module.exports = getFolderContent;