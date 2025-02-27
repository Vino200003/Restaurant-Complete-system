const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
const user = require('../models/user');

//Sign Up
function signUp(req, res) {
    models.User.findOne({ where: { email: req.body.email } })
        .then(result => {
            if (result) {
                return res.status(409).json({
                    message: "Email already exists!",
                });
            } else {
                bcryptjs.genSalt(10, function (err, salt) {
                    if (err) {
                        console.error('Error generating salt:', err);
                        return res.status(500).json({
                            message: "Error generating salt",
                        });
                    }

                    bcryptjs.hash(req.body.password, salt, function (err, hash) {
                        if (err) {
                            console.error('Error hashing password:', err);
                            return res.status(500).json({
                                message: "Error hashing password",
                            });
                        }

                        const user = {
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            role: req.body.role || 'customer' // Default role is 'customer'
                        };

                        models.User.create(user)
                            .then(result => {
                                console.log('User created:', result);
                                res.status(201).json({
                                    message: "User created successfully",
                                });
                            })
                            .catch(error => {
                                console.error('Error creating user:', error);
                                res.status(500).json({
                                    message: "Something went wrong",
                                    error: error.message
                                });
                            });
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error finding user:', error);
            res.status(500).json({
                message: "Something went wrong",
                error: error.message
            });
        });
}

function login(req, res) {
    models.User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user === null) {
                return res.status(401).json({
                    message: "Invalid credentials!",
                });
            } else {
                bcryptjs.compare(req.body.password, user.password, function (err, result) {
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        return res.status(500).json({
                            message: "Something went wrong",
                        });
                    }

                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user.id,
                                role: user.role
                            },
                            process.env.JWT_KEY,
                            { expiresIn: '1h' }
                        );

                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            message: "Invalid credentials!",
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error finding user:', error);
            res.status(500).json({
                message: "Something went wrong",
                error: error.message
            });
        });
}

// Get all users
function getAllUsers(req, res) {
    models.User.findAll({
        attributes: { exclude: ['password'] } // Exclude password for security
    })
    .then(users => {
        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
        }
        res.status(200).json(users);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    });
}

// Get user by ID
function getUserById(req, res) {
    const id = req.params.id;
    
    models.User.findByPk(id, {
        attributes: { exclude: ['password'] } // Exclude password for security
    })
    .then(user => {
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.status(200).json(user);
    })
    .catch(error => {
        console.error('Error fetching user:', error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    });
}

// Get users by role
function getUsersByRole(req, res) {
    const role = req.params.role;
    
    // Validate role against the ENUM values in your model
    const validRoles = ['customer', 'kitchen_staff', 'delivery_person', 'admin'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            message: "Invalid role specified"
        });
    }
    
    models.User.findAll({
        where: { role: role },
        attributes: { exclude: ['password'] } // Exclude password for security
    })
    .then(users => {
        if (users.length === 0) {
            return res.status(404).json({
                message: `No users with role '${role}' found`
            });
        }
        res.status(200).json(users);
    })
    .catch(error => {
        console.error('Error fetching users by role:', error);
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    });
}

// Update user
function updateUser(req, res) {
    const id = req.params.id;
    const updates = {};
    
    // Only update fields that are provided
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.role) updates.role = req.body.role;
    
    // Handle password update separately if provided
    if (req.body.password) {
        bcryptjs.genSalt(10, function(err, salt) {
            if (err) {
                return res.status(500).json({
                    message: "Error generating salt"
                });
            }
            
            bcryptjs.hash(req.body.password, salt, function(err, hash) {
                if (err) {
                    return res.status(500).json({
                        message: "Error hashing password"
                    });
                }
                
                updates.password = hash;
                performUpdate();
            });
        });
    } else {
        performUpdate();
    }
    
    function performUpdate() {
        models.User.findByPk(id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                
                return user.update(updates);
            })
            .then(updatedUser => {
                if (updatedUser) {
                    // Create a safe version of the user without password
                    const safeUser = updatedUser.toJSON();
                    delete safeUser.password;
                    
                    res.status(200).json({
                        message: "User updated successfully",
                        user: safeUser
                    });
                }
            })
            .catch(error => {
                console.error('Error updating user:', error);
                res.status(500).json({
                    message: "Something went wrong",
                    error: error.message
                });
            });
    }
}

// Delete user
function deleteUser (req, res) {
    const id = req.params.id;

    models.User.findByPk(id)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "User  not found"
                });
            }

            return user.destroy();
        })
        .then(() => {
            res.status(200).json({
                message: "User  deleted successfully"
            });
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            res.status(500).json({
                message: "Something went wrong",
                error: error.message
            });
        });
}

module.exports = {
    signUp: signUp,
    login: login,
    getAllUsers: getAllUsers,
    getUserById: getUserById,
    getUsersByRole: getUsersByRole,
    updateUser:  updateUser ,
    deleteUser:  deleteUser  
};