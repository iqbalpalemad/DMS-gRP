const grpc                  = require("grpc");
const protoLoader           = require("@grpc/proto-loader");
const dotenv                = require('dotenv');
const mongoose              = require('mongoose');

dotenv.config();

const userPackageDef        = protoLoader.loadSync("./protocol_buffers/User.proto",{});
const userGrpcObject        = grpc.loadPackageDefinition(userPackageDef);
const userPackage           = userGrpcObject.userPackage;

const folderPackageDef      = protoLoader.loadSync("./protocol_buffers/Folder.proto",{});
const folderGrpcObject      = grpc.loadPackageDefinition(folderPackageDef);
const folderPackage         = folderGrpcObject.folderPackage;



const createUser            = require('./controller/user/createUser');
const login                 = require('./controller/user/login');

const createFolder          = require('./controller/folder/create');
const updateFolder          = require('./controller/folder/update');

mongoose.connect(process.env.DB_CONNECT,
    { 
        useUnifiedTopology: true, 
        useNewUrlParser: true 
    }, () =>
    {
    console.log("connected to db");
    }
)


const server            = new grpc.Server();

server.addService(userPackage.userService.service,{
    "createUser" : createUser,
    "login" : login
})

server.addService(folderPackage.folderService.service,{
    "create" : createFolder,
    "update" : updateFolder
})


server.bind(process.env.HOST, grpc.ServerCredentials.createInsecure());
console.log("Server running at " + process.env.HOST);
server.start();