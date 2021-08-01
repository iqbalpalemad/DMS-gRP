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
        
        if(call.request.folderId != "home" && !mongoose.isValidObjectId(call.request.folderId)){
            response = {
                result   : false,
                message  : "Invalid folder ID"
            }
            return callback(null,response);
        }
        if(call.request.folderId != "home"){
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
        }
        let match;
        const aggregate = [];
        if(call.request.folderId == "home"){
            match      = { $match: {"name" : "home", "userId" : mongoose.Types.ObjectId(validToken.userId) } };
        }
        else{
            match      = { $match: {"_id" : mongoose.Types.ObjectId(call.request.folderId), "userId" : mongoose.Types.ObjectId(validToken.userId) } };
        }
        aggregate.push(match);
        if(call.request.type == "all" || call.request.type == "folder"){
            const folderLookup = {
                $lookup : {
                    from         : "folders",
                    localField   : "_id",
                    foreignField : "parentFolderId",
                    as           : "folders"
                }
            }
            aggregate.push(folderLookup);
        }
        if(call.request.type == "all" || call.request.type == "file"){
            const fileLookup = {
                $lookup : {
                    from         : "files",
                    localField   : "_id",
                    foreignField : "parentFolderId",
                    as           : "files"
                }
            }
            aggregate.push(fileLookup);
        }
        const contents = await Folder.aggregate(aggregate)
        response = {
            result   : true,
            message  : "Folder Content fetch success",
            name     : contents[0].name,
            userId   : contents[0].userId,
            folderId : contents[0]._id
        }
        if(contents[0].parentFolderId){
            response.parentFolderId = contents[0].parentFolderId;
        }
        const  foldersReturn = [];
        const  filesReturn = [];
        if(contents[0].folders){
            contents[0].folders.forEach(element => {
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
        if(contents[0].files){
            contents[0].files.forEach(element => {
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

        if(call.request.type == "all" || call.request.type == "folder"){
            response.folders = foldersReturn;
        }
        if(call.request.type == "all" || call.request.type == "file"){
            response.files = filesReturn;
        }
        console.log(response);
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