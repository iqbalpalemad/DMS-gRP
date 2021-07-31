const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
{
    name : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    parentFolderId : {
        type : mongoose.Schema.Types.ObjectId,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Folder',folderSchema);