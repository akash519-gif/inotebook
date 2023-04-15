const express = require('express');
const Notes = require('../models/Notes');
const router = express.Router();
const fetchuser= require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

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

//Route 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 char').isLength({ min: 5 })
], async (req, res)=>{

    try{
        const { title, description, tag } = req.body;
        // If there are errors, return Bad requests and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title: title, description: description, tag: tag, user: req.user.id
        });
        const savedNote = await note.save()
        res.json(savedNote)
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal server error occured")
    }
})

module.exports = router