const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cinema_db',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db = mongoose.connection;

db.on('error',(err)=>{
    console.log(err);
});

db.once('open',()=>{
    console.log("Connected to MongoDb");
})
