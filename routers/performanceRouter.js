const express = require('express');
const Film = require('../models/film');
const CinemaHall = require('../models/cinemaHall');
const Performance = require('../models/performance');
const { body, validationResult } = require('express-validator');
const session = require('express-session');
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


router.get('/performances', async (req,res) =>{
    let performances = await Performance.find({});
    let films = [];
    performances.forEach(performance => {
        films.push(Film.findById(performance.film));
    })
    films = await Promise.all(films)
    res.render('performance/performances',{performances,films});
})


//Add Performance GET
router.get('/performances/add',async(req,res)=>{
    let films = await Film.find({});
    let cinemaHalls = await CinemaHall.find({});
    res.render('performance/add_performance',{films,cinemaHalls});
})

//Add Performance POST
router.post('/performances/add',body('film')
                            .notEmpty()
                            .withMessage('Film is required'),
                            body('cinemaHall').notEmpty()
                            .withMessage('Cinema Hall is required'),
                            body('date').notEmpty()
                            .withMessage('Date is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let films = await Film.find({});
        let cinemaHalls = await CinemaHall.find({});
        res.render('performance/add_performance',{films,cinemaHalls,errors:errors.array()});
    }else{
        let performance = new Performance(req.body);
        let film = await Film.findById(req.body.film);
        let cinemaHall = await CinemaHall.findById(req.body.cinemaHall);

        performance.film = film;
        performance.cinemaHall = cinemaHall;

        performance.save((err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Performance Added')
                res.redirect('/performances');
            }
        });    
    }
})

//Get Single Performance
router.get('/performances/performance/:id',async (req,res)=>{
   let performance = await Performance.findById(req.params.id);
   let film = await Film.findById(performance.film);
   let cinemaHall = await CinemaHall.findById(performance.cinemaHall);

   res.render('performance/performance',{performance,film,cinemaHall});
})

//Edit Single Performance Form
router.get('/performances/performance/edit/:id', async (req,res)=>{
    let performance = await Performance.findById(req.params.id)
    let films = await Film.find({});
    let cinemaHalls = await CinemaHall.find({});
    res.render('performance/edit_performance',{performance,films,cinemaHalls});
})

//Edit Single Performance Post
router.post('/performances/performance/edit/:id',body('film')
                                                .notEmpty()
                                                .withMessage('Film is required'),
                                                body('cinemaHall').notEmpty()
                                                .withMessage('Cinema Hall is required'),
                                                body('date').notEmpty()
                                                .withMessage('Date is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let performance = await Performance.findById(req.params.id)
        let films = await Film.find({});
        let cinemaHalls = await CinemaHall.find({});
        res.render('performance/edit_performance',{performance,films,cinemaHalls,errors:errors.array()});
    }else{
        let performance = {};
        let film = await Film.findById(req.body.film);
        let cinemaHall = await CinemaHall.findById(req.body.cinemaHall);

        performance.film = film;
        performance.cinemaHall = cinemaHall;
        let query = {_id:req.params.id}

        Performance.update(query,performance,(err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Performance Updated')
                res.redirect('/performances');
            }
    })
    }

})

//Delete Single Film
router.delete('/performances/performance/:id',async (req,res)=>{
   let query = {_id:req.params.id};
        
   Performance.remove(query,(err)=>{
       if(err){
           console.log(err);
       }else{
           res.send('Success');
       }
   })

})

module.exports = router;