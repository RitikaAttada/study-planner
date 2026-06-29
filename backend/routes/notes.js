const express=require('express');
const router=express.Router();
const Note=require('../models/Note');
const auth=require('../middleware/auth');

router.get('/', auth, async (req, res)=>{
    try{
        const notes= await Note.find({user:req.user.id}).sort({createrAt: -1});
        res.json(notes);
    }
    catch{
        res.status(500).json({message:'Server error'});
    }
});

router.post('/', auth, async (req, res)=>{
    try{
        const {title, content}=req.body;
        const note= await Note.create({user:req.user.id, title, content});
        res.json(note);
    }
    catch{
        res.status(500).json({message:'Server error'});

    }
});

router.delete('/:id', auth, async(req, res)=>{
    try{
        await Note.findByIdAndDelete(req.params.id);
        res.json({message:'Note deleted'});
    }
    catch{
        res.status(500).json({message:'Server error'});
    }
});

module.exports=router;