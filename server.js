const grpc                  = require("grpc");
const protoLoader           = require("@grpc/proto-loader");
const dotenv                = require('dotenv');
const mongoose              = require('mongoose');
const {setupRedis}          = require('./utils/redis');

dotenv.config();

const userPackageDef        = protoLoader.loadSync("./protocol_buffers/User.proto",{});
const userGrpcObject        = grpc.loadPackageDefinition(userPackageDef);
const userPackage           = userGrpcObject.userPackage;

const folderPackageDef      = protoLoader.loadSync("./protocol_buffers/Folder.proto",{});
const folderGrpcObject      = grpc.loadPackageDefinition(folderPackageDef);
const folderPackage         = folderGrpcObject.folderPackage;

const filePackageDef        = protoLoader.loadSync("./protocol_buffers/File.proto",{});
const fileGrpcObject        = grpc.loadPackageDefinition(filePackageDef);
const filePackage           = fileGrpcObject.filePackage;



const createUser            = require('./controller/user/createUser');
const login                 = require('./controller/user/login');

const createFolder          = require('./controller/folder/create');
const updateFolder          = require('./controller/folder/update');
const deleteFolder          = require('./controller/folder/delete');
const moveFolder            = require('./controller/folder/move');
const getFolder             = require('./controller/folder/get');
const getFolderContent      = require('./controller/folder/getContents');


const createFile            = require('./controller/file/create');
const updateFile            = require('./controller/file/update');
const deleteFile            = require('./controller/file/delete');
const moveFile              = require('./controller/file/move');
const getFile               = require('./controller/file/get')

mongoose.connect(process.env.DB_CONNECT,
    { 
        useUnifiedTopology: true, 
        useNewUrlParser: true 
    }, () =>
    {
    console.log("connected to db");
    }
)

setupRedis();

const server            = new grpc.Server();

server.addService(userPackage.userService.service,{
    "createUser" : createUser,
    "login" : login
})

server.addService(folderPackage.folderService.service,{
    "create"        : createFolder,
    "update"        : updateFolder,
    "delete"        : deleteFolder,
    "move"          : moveFolder,
    "get"           : getFolder,
    "getContent"    : getFolderContent
})


server.addService(filePackage.fileService.service,{
    "create" : createFile,
    "update" : updateFile,
    "delete" : deleteFile,
    "move"   : moveFile,
    "get"    : getFile,
})


server.bind(process.env.HOST, grpc.ServerCredentials.createInsecure());
console.log("Server running at " + process.env.HOST);
server.start();