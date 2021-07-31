const grpc                  = require("grpc");
const protoLoader           = require("@grpc/proto-loader");
const dotenv                = require('dotenv').config({path : '../.env'});
const mongoose              = require('mongoose');

const userPackageDef        = protoLoader.loadSync("../protocol_buffers/User.proto",{});
const userGrpcObject        = grpc.loadPackageDefinition(userPackageDef);
const userPackage           = userGrpcObject.userPackage;

const createUser            = require('./controller/user/createUser');

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
    "createUser" : createUser
})


server.bind(process.env.HOST, grpc.ServerCredentials.createInsecure());
console.log("Server running at " + process.env.HOST);
server.start();