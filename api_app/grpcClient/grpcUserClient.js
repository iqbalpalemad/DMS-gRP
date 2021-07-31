const grpc                  = require("grpc");
const protoLoader           = require("@grpc/proto-loader");
const dotenv                = require('dotenv').config({path : '../.env'});

const userPackageDef        = protoLoader.loadSync("../protocol_buffers/User.proto",{});
const userGrpcObject        = grpc.loadPackageDefinition(userPackageDef);
const userPackage           = userGrpcObject.userPackage;

const grpcUserclient        = new userPackage.userService(process.env.HOST , 
                                            grpc.credentials.createInsecure());


module.exports              = grpcUserclient;