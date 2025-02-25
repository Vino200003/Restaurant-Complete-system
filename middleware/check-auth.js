const jwt = require('jsonwebtoken');

function chechAuth(req, res, next){//name these 3 parameters anything you want
    try{
        const token = req.headers.authorization.split(" ")[1]; //split the string and get the 2nd half of the string that is token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decodedToken;
        next(); //it hands over the execution to the middleware
    }catch(e){
        returnres.status(401).json({
            'message': "Invalid or expires token provied!",
            'error': e
        });

    }
}


module.exports ={
    chechAuth:chechAuth
}