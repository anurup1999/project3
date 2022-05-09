const express = require('express');

var bodyParser = require('body-parser');

const route = require('./route/route.js');

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


const mongoose = require('mongoose');
const { response } = require('express');

mongoose.connect("mongodb+srv:Project-1-Group:CaBrSNjCFD2YQuqc@cluster0.w5bka.mongodb.net/Project-1-Group-DB")
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

    
app.use(
    function (req,res,next){
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'),',',req.ip,',',req.method,',',req.path);
        next();
    }
);




app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});