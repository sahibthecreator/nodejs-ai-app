const User = require('../models/user');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();


function getById(req, res) {
    const id = req.params.id;

    User.getById(id, (user) => {
        if (user) {
            res.status(200).json({ user });
        }else{
            res.status(204);
        }
    })
}

function uploadProfilePicture(req, res) {
    const id = req.params.id;
    User.updateProfilePicture(id, req.file.originalname, (affectedRows) => {
        if (affectedRows > 0) {
            res.status(200).json({ "message": 'success' });
        } else {
            res.status(500).json({ "message": 'failed' });
        }
    })
}

function login(req, res) {
    const { username, password } = req.body.data;
    // Check if the username or email exists
    User.getByUsername(username, async (user) => {
        if (!user) {
            // If the user doesn't exist, return an error
            return res.status(401).json({ error: 'Invalid Username' });
        }

        // Password validation
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(user.username, process.env.JWT_KEY);

        res.status(200).json({ user: user.id, token });
    });
}

async function register(req, res) {
    const { fullName, username, email, password } = req.body.data;
    // Check if the username or email already exists
    User.getByUsername(username, (user) => {
        if (user) {
            // If the user already exists, return an error
            return res.status(409).json({ error: 'Username already exists' });
        }
    });
    User.getByEmail(email, (user) => {
        if (user) {
            // If the user already exists, return an error
            return res.status(409).json({ error: 'Email already exists' });
        }
    })

    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User(fullName, username, email, hash);

    // Save the new user to the database
    User.create(newUser, (user) => {
        if (user) {
            res.status(200).json({ success: 'Registration successful' });
        }
    });
}


module.exports = { getById, uploadProfilePicture, login, register };