const bcrypt          = require('bcrypt');
const User            = require('../../Model/User')
const Folder          = require('../../Model/Folder')



const createUser = async (call,callback) => {

    try{
        let userResponse = {};
        const existingUser = await User.findOne({email:call.request.email});
        if(existingUser){
            userResponse.result  = false,
            userResponse.message = "Email address already taken"
            return callback(null,userResponse);
        }
        const passwordHash = await bcrypt.hash(call.request.password,12);
        const user         = new User({
                email    : call.request.email,
                password : passwordHash
        });
        const save = await user.save();
        const folder = new Folder({
            name   : "home",
            userId : save._id
        })
        const saveFolder = await folder.save();
        userResponse.result  = true,
        userResponse.message = save._id
        userResponse.homeFolderId = saveFolder._id;
        return callback(null,userResponse);
    }
    catch(err){
        const userResponse = {
            result  : false,
            message : err.message
        }
        return callback(null,userResponse);
    }
}

module.exports = createUser;