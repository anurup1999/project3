const jwt = require('jsonwebtoken');

const authentication = async function (req, res, next) 
{
    
    try 
    { 
        const token = req.headers['x-api-key'];
        
        if (!token) 
            
            res.status(400).send({ status: false, msg: "request is missing a mandatory token header" });

        const decodedToken = jwt.verify(token, 'projectThird');

        if (!decodedToken)
            
            res.status(400).send({status: false, msg: "user not found"});
        
        req.validToken = decodedToken;
        next();
    }
    catch (error) 
    {
        res.status(500).send({status: false, msg: error.message})
    }
};

module.exports.authentication=authentication;