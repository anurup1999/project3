const express = require('express');
var bodyParser = require('body-parser');
const route = require('./route/route.js');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://Project-3-Group:gGb2XPlJjoTrWYhB@cluster0.w5bka.mongodb.net/group3Database")
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err));
    
app.use(
    function (req,res,next){
        const date = new Date();
        let currDateAndTime = date.toString().split(' ');
        console.log(currDateAndTime[2],currDateAndTime[1],currDateAndTime[3],currDateAndTime[4],',',req.ip,',',req.method,',',req.path);
        next();
    }
);

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});