const express = require('express');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
const e = require('express');
const Film = require('../models/film');
const Performance = require('../models/performance');
const Genre = require('../models/genre');
const router = express.Router();

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


router.get('/genres',async (req,res) =>{
   
    Genre.find({}, (err,genres)=>{
       genres.forEach((genre)=>{
       })
       if(err){
           console.log(err);
       }else{
           res.render('genre/genres',{genres});
       } 
   });
  
})

//Add Genre GET
router.get('/genres/add',async(req,res)=>{
   res.render('genre/add_genre');
})

//Add Genre POST
router.post('/genres/add',body('name')
                            .notEmpty()
                            .withMessage('Name is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('genre/add_genre',{
            errors:errors.array()
        })
    }else{
        let genre = new Genre();
        genre.name = req.body.name;

        genre.save((err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Genre Added')
                res.redirect('/genres');
            }
        });
    }
})

//Get Single Genre
router.get('/genres/genre/:id',(req,res)=>{
   Genre.findById(req.params.id,(err,genre)=>{
       console.log(genre);
       if(err){
           console.log(err);
       }else{
           res.render('genre/genre',{genre});
       }
   });
})

//Edit Single Genre Form
router.get('/genres/genre/edit/:id',(req,res)=>{
   Genre.findById(req.params.id,(err,genre)=>{
       res.render('genre/edit_genre',{
           genre
       })
   })
})

//Edit Single Genre
router.post('/genres/genre/edit/:id',body('name')
                                    .notEmpty()
                                    .withMessage('Name is required'),(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        Genre.findById(req.params.id,(err,genre)=>{
            res.render('genre/edit_genre',{
                genre,errors:errors.array()
            })
        })    
    }else{
        let genre = {};
        genre.name = req.body.name;
        let query = {_id:req.params.id}

        Genre.update(query,genre,(err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Genre Updated')
                res.redirect('/genres');
            }
    })
    }

})

//Delete Single Post
router.delete('/genres/genre/:id', async (req,res)=>{
    let query = {_id:req.params.id}
    let genre = await Genre.findOne(query)
    let films = await Film.find({ genre: genre })
    films.forEach(async film => {
        await Performance.deleteMany({film: film}).exec()
    })
    await Film.deleteMany({genre: genre}).exec()
   Genre.remove(query,(err)=>{
       if(err){
           console.log(err);
       }else{
           res.send('Success');
       }
   })

})

module.exports = router;