const express = require('express');
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

//Cinema Hall List GET
router.get('/cinemaHalls',async (req,res) =>{
    let cinemaHalls = await CinemaHall.find({});
    res.render('cinemaHall/cinemaHalls',{cinemaHalls});
})

//Add Cinema Hall GET
router.get('/cinemaHalls/add',(req,res)=>{
    res.render('cinemaHall/add_cinemaHall');
})

//Add Cinema Hall POST
router.post('/cinemaHalls/add',body('name')
                                .notEmpty()
                                .withMessage('Name is required'),
                                body('nOfSeats')
                                .notEmpty()
                                .withMessage('Number of Seats is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('cinemaHall/add_cinemaHall',{
            errors:errors.array()
        })
    }else{
        let cinemaHall = new CinemaHall(req.body);
        cinemaHall.save((err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Cinema Hall Added')
                res.redirect('/cinemaHalls');
            }
        });    
    }
})

//Get Single Cinema Hall
router.get('/cinemaHalls/cinemaHall/:id',async (req,res)=>{
    let cinemaHall = await CinemaHall.findById(req.params.id);
    res.render('cinemaHall/cinemaHall',{cinemaHall});     
})

//Edit Single Cinema Hall Form
router.get('/cinemaHalls/cinemaHall/edit/:id',async (req,res)=>{
    let cinemaHall = await CinemaHall.findById(req.params.id);
    res.render('cinemaHall/edit_cinemaHall',{cinemaHall})
})

//Edit Single Cinema Hall
router.post('/cinemaHalls/cinemaHall/edit/:id',body('name')
                                            .notEmpty()
                                            .withMessage('Name is required'),
                                            body('nOfSeats').notEmpty()
                                            .withMessage('Number Of Seats is required'),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let cinemaHall = await CinemaHall.findById(req.params.id);
        res.render('cinemaHall/edit_cinemaHall',{cinemaHall,errors:errors.array()})    
    }else{
        let cinemaHall = req.body;
        let query = {_id:req.params.id}

        CinemaHall.update(query,cinemaHall,(err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash('success','Cinema Hall Updated')
                res.redirect('/cinemaHalls');
            }
        })
    }

})

//Delete Single Cinema Hall
router.delete('/cinemaHalls/cinemaHall/:id',async (req,res)=>{
   let query = {_id:req.params.id};
   await Performance.deleteMany({cinemaHall: query}).exec()
        
   CinemaHall.deleteOne(query,(err)=>{
       if(err){
           console.log(err);
       }else{
           res.send('Success');
       }
   })
})

module.exports = router;