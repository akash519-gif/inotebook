const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')

const JWT_SECRET= 'aKASHISAKASH'


// Create a User using: POST "/api/auth/createuser". No Login required
router.post('/createuser', [
    body('name', 'Enter a Valid name').isLength({ min: 3 }),
    body('email', 'Enter a Valid email').isEmail(),
    body('password', 'Password must be atleast 5 char').isLength({ min: 5 })
], async (req, res) => {

    // If there are errors, return Bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, user with this email only present" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user:{
                id:user.id
            }
        }
        const authtoken= jwt.sign(data, JWT_SECRET);
        console.log(authtoken);

        res.json({authtoken})
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")

    }
})

module.exports = router