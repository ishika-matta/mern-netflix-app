const router = require('express').Router();
const List = require('../models/List');
const verify = require('../verifyToken');


//CREATE
router.post('/', verify, async(req,res) => {
    if(req.user.isAdmin) {
        const newList = new List(req.body);

        try{
            const savedList = await newList.save();
            res.status(201).json(savedList);
        }catch(err){
            res.status(500).json(err);
        }
    } else { 
        res.status(403).json('you are not allowed');
    }
});

//DELETE
router.delete('/:id', verify, async(req,res) => {
    if(req.user.isAdmin) {
        try{
            await List.findByIdAndDelete(req.params.id);
            res.status(201).json('list has been deleted');
        }catch(err){
            res.status(500).json(err);
        }
    } else { 
        res.status(403).json('you are not allowed');
    }
});

//GET 
router.get('/find/:id', verify, async(req,res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try{
        if (typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                        { $sample : { size : 10 }},
                        { $match : { type : typeQuery , genre : genreQuery }},
                ]);
            } else{
                list = await List.aggregate([
                    { $sample : { size : 10 }},
                    { $match : { type : typeQuery }},
                ]);
            }
            
        }else{
            list = await List.aggregate([
                { $sample : { size : 10 }},
            ]);
        }
        res.status(201).json(list);
    }catch(err){
        res.status(500).json(err);
    }
});


//UPDATE
router.put('/:id', verify, async(req,res) => {
    if(req.user.isAdmin) {
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
                                                                {$set : req.body},
                                                                {new : true});
            res.status(200).json(updatedMovie);
        }catch(err){
            res.status(500).json(err);
        }
    } else { 
        res.status(403).json('you are not allowed');
    }
});





;


//GET RANDOM
router.get('/random', verify, async(req,res) => {
    const type = req.query.type;
    let movie;
    try{
        if ( type === 'series'){
            movie = await Movie.aggregate([
                { $match : { isSeries : true }},
                { $sample : { size : 1 }},
            ]);

        }else{
            movie = await Movie.aggregate([
                { $match : { isSeries : false }},
                { $sample : { size : 1 }},
            ]);
        }
        res.status(200).json(movie);
    }catch(err){
        res.status(500).json(err);
    }
});


//GET ALL
router.get('/', verify, async(req,res) => {
    if(req.user.isAdmin) {
        try{
            const movies = await Movie.find();
            res.status(200).json(movies.reverse());
        }catch(err){
            res.status(500).json(err);
        }
    } else { 
        res.status(403).json('you are not allowed');
    }
});


module.exports = router;