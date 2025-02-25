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
                                userId: user.id, // Use `id` instead of `userId`
                                role: user.role
                            },
                            process.env.JWT_KEY, // Ensure this is defined in .env
                            { expiresIn: '1h' } // Token expiration time
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



module.exports = {
    signUp: signUp,
    login: login
}