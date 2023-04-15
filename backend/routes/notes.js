const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();
const fetchuser= require('../middleware/fetchuser');

//Route 1: Get All the notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try{
        const notes = await Notes.find({user: req.user.id}); 
        res.json(notes)
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error occured")
    }

})

module.exports = router