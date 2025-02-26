const jwt = require('jsonwebtoken');

function checkAuth(req, res, next) {
    try {
        // Ensure authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ 
                message: "Authorization header missing!" 
            });
        }

        const token = req.headers.authorization.split(" ")[1]; // Extract token from header
        if (!token) {
            return res.status(401).json({ 
                message: "Authentication failed! No token provided." 
            });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decodedToken; // Store decoded data in request
        next(); // Pass control to next middleware
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token provided!",
            error: error.message
        });
    }
}

module.exports = { checkAuth };