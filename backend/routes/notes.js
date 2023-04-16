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

//Route 3: Update an existing Note using: POST "/api/notes/updatenote". Login required

router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    const { title, description, tag } = req.body;
    // Create a newNote Object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // Find the note to be updated and update it.
    let note = await Notes.findById( req.params.id); /* Always remember to write await otherwise errors will 
    be very confusing. Also function using await should always be async. And, remember to not use const for variable
    which is to assigned again. Try to use let or var in place of const when this type of condn occur otherwise
    always use const.   */
    if(!note){res.status(404).send("Not Found")}

    /* Checking if notes retrieved using params id(which is id for note which is to be updated) 
    were created by user hitting endpoint or not. As fetchuser gives user 
    on behalf of auth-token and it may happen that id provided in this endpoint is of notes from some different user 
    so to confirm that user who is hitting endpoint is the user who is accessing notes of his own only. so we can 
    match both and verify and then update. As you know that notes also contain userid of user who created it. So, 
    note.user.toString() represent id of user from notes signifying that this user has created this note and
    req.user.id refers user id from fetchuser which uses auth-token and gives user id on behalf of it. Now, as auth-token
    of current user will be given to hit this update endpoint. So, if both note.user.toString() and req.user.id are equal
    then it means that user hitting endpoint is the user who has access to update the notes . Remember a user can have many
     different notes in the database.*/
    if(note.user.toString() !== req.user.id)
    {
        return res.status(401).send("Not allowed")
    }

    note = await Notes.findByIdAndUpdate( req.params.id, {$set: newNote}, {new:true})
    res.json(note)

})

module.exports = router