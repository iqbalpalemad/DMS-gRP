const grpcClient            = require('../../grpcClient/grpcUserClient');
const { validationResult }  = require('express-validator')

const signup =  (req,res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({result : false, errors: errors.array() })
    }
    try{
        const userRequest = {
            email    : req.body.email,
            password : req.body.password
        }
        grpcClient.createUser(userRequest, (err, response) => {
            if(err){
                res.status(500).json({result : false, error : err.message});
            }

            res.status(201).json(response);
        })
    }
    catch(err){
        res.status(500).json({result : false, error : err.message});
    }
}


module.exports = signup;