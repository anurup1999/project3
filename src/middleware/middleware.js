// ================ imports ===========================================================================================//

const jwt = require('jsonwebtoken');

// ================ Authentication Middleware ===========================================================================================//

const authentication = async function (req, res, next) 
{
    
    try 
    { 
        const token = req.headers['x-api-key'];
        
        if (!token) 
            
            res.status(400).send({ status: false, msg: "request is missing a mandatory token header" });

        const decodedToken = jwt.decode(token);
        
        if(decodedToken._id==undefined)
        
            return res.status(401).send({status : false , message : "Invalid Token."});

        decodedToken = jwt.verify(token,'projectThird');

        req.validToken = decodedToken;
        next();
    }
    catch (error) 
    {
        res.status(500).send({status: false, msg: error.message})
    }
};

// ================ exports ===========================================================================================//

module.exports.authentication=authentication;