const   mongoose     = require('mongoose');
const   File         = require('../../Model/File');
const   isValidToken = require('../../utils/token');

const createFile = async (call,callback) => {

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

        const file = new File({
            name   : call.request.name,
            userId : mongoose.Types.ObjectId(validToken.userId)
        })

        if(call.request.parentFolderId !== ""){
            file.parentFolderId = mongoose.Types.ObjectId(call.request.parentFolderId);
        }

        if(call.request.content !== ""){
            file.content = mongoose.Types.ObjectId(call.request.parentFolderId);
        }

        const save = await file.save();
        response = {
            result   : true,
            message  : "file created succesfully",
            fileId : save._id
        }
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

module.exports = createFile;

