const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema(
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
        },
        content : {
            type : String,
        }
    },
    { timestamps: true }
    );
    
    module.exports = mongoose.model('File',fileSchema);