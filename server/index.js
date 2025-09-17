const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');

//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DB connected'))
.catch((err) => console.log('DB not connected', err));

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/clubRoutes'));

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));