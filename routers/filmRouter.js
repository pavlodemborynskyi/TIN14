const express = require('express');
const Film = require('../models/film');
const Genre = require('../models/genre');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const e = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))
router.use(require('connect-flash')());
router.use((req,res,next)=>{
    res.locals.messages = require('express-messages')(req,res);
    next();
})


// Film List GET
router.get('/films',async (req,res) =>{
   let films = await Film.find({});
   res.render('film/films',{films});
})

//Add Film GET
router.get('/films/add',async(req,res)=>{
    let genres = await Genre.find({});
    res.render('film/add_film',{genres});
})

//Add Film POST
router.post('/films/add',body('name')
                            .notEmpty()
                            .withMessage('Name is required'),
                        body('genre').notEmpty()
                            .withMessage('Genre is required'),
                        body('director').notEmpty()
                            .withMessage('Name of Director is required'),
                        body('country').notEmpty()
                            .withMessage('Country is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const genres = await Genre.find({});
        res.render('film/add_film',{
            genres,errors:errors.array()
        })
    }else{
        let film = new Film(req.body);
        let genre = await Genre.findById(req.body.genre);
        film.genre = genre

        film.save((err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Film Added')
                res.redirect('/films');
            }
        });    
    }
})

//Get Single Film
router.get('/films/film/:id',async (req,res)=>{
    console.log(req.params.id);
   let film = await Film.findById(req.params.id);
   console.log(req.body_id);
    Genre.findById(film.genre,(err,genre)=>{
        if(err){
            console.log(err);
        }else{   
            console.log(genre); 
            res.render('film/film',{film,genre});
        }    
    })
})

//Edit Single Film Form
router.get('/films/film/edit/:id', (req,res)=>{
   Film.findById(req.params.id,async (err,film)=>{
       let genres = await Genre.find({});
       res.render('film/edit_film',{
            film,
            genres
       })
   })
})

//Edit Single Film
router.post('/films/film/edit/:id',body('name')
                                    .notEmpty()
                                    .withMessage('Name is required'),
                                    body('genre').notEmpty()
                                    .withMessage('Genre is required'),
                                    body('director').notEmpty()
                                    .withMessage('Name of Director is required'),
                                    body('country').notEmpty()
                                    .withMessage('Country is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let genres = await Genre.find({});
        Film.findById(req.params.id,(err,film)=>{
            res.render('film/edit_film',{
                film,genres,errors:errors.array()
            })
        })    
    }else{
        let film = {};
        film.name = req.body.name;
        film.genre = req.body.genre;
        film.director = req.body.director;
        film.country = req.body.country;
        let query = {_id:req.params.id}

        Film.update(query,film,(err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Film Updated')
                res.redirect('/films');
            }
    })
    }

})

//Delete Single Film
router.delete('/films/film/:id',async (req,res)=>{
   let query = {_id:req.params.id};
   let film = await Film.findOne(query);
   await Performance.deleteMany({film: film}).exec();
        
   Film.remove(query,(err)=>{
       if(err){
           console.log(err);
       }else{
           res.send('Success');
       }
   })

})

module.exports = router;