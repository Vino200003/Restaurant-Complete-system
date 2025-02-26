function checkRole(role) {
    return (req, res, next) => {
        if (req.userData.role !== role) {
            return res.status(403).json({ message: "Access denied! Unauthorized role." });
        }
        next();
    };
}

module.exports = { checkRole };