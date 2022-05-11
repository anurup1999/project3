const express = require('express');
var bodyParser = require('body-parser');
const route = require('./route/route.js');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://Project-3-Group:gGb2XPlJjoTrWYhB@cluster0.w5bka.mongodb.net/group3Database")
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err));

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});