const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const genreRouter = require('./routers/genreRouter');
const filmRouter = require('./routers/filmRouter');
const cinemaHallRouter = require('./routers/cinemaHallRouter');
const performanceRouter = require('./routers/performanceRouter');
require('./db/db');

const app = express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"/public")));

app.use(genreRouter);
app.use(filmRouter);
app.use(cinemaHallRouter);
app.use(performanceRouter);


app.get('/',(req,res)=>(
    res.render('index')
))

app.listen(3000,()=>{
    console.log("Server running on port 3000");
})