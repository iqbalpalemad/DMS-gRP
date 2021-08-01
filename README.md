# DMS-gRP
This repository contains a nodejs document management application implemented using gRPC microservice framework

## Local development

* Clone the repository 
* Run `$ npm install` inside the repository to install the required dependencies
* Copy the sample configuration file and edit it to match your configuration.
  `$ cp .env.sample .env`
 * Replace following environment variables in .env file:
 
    DB_CONNECT   : mongodb connection string
    
    JWT_SECRET   : secret used to create json web token used for authentication
    
    HOST         : enter the host and port for this application to run (127.0.0.1:5005)
    
    REDIS_HOST   : redis host name for database cache
    
    REDIS_PORT   : redis port
    
    REDIS_SECRET : redis secret
    
  * Run  `$ npm start` to run the application
  
  ## Docker setup
  
  * Please builde the docker container using the Dockerfile provided here
  * Run The docker container with port 5005 (specified in HOST in .env) map to local host 5005 port
    
