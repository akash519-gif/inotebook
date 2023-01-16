const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');



// Create a User using: POST "/api/auth/createuser". No login required.
router.post('/createuser',[body('email','Enter a Valid Email').isEmail(),body('name','Enter a Valid Name').isLength({ min: 3 }),body('password','Password must be atleast 5 characters').isLength({ min: 5 })], (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,  
        password: req.body.password,
        email: req.body.email
      }).then(user => res.json(user))
      .catch(err => {console.log(err)
    res.json({error: 'Please enter a unique value for email', meassage: err.message})})
})

module.exports = router