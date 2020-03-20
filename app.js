require('express-async-errors');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/index');
const error = require('./common/error'); 
require('dotenv/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/userService',  userRoute);
app.use(error);

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser : true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB");
});

app.listen(5000);
console.log("Listening to the port 5000");
module.exports = app;
