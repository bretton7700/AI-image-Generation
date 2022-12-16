const path = require("path");
const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;


const app = express();


//Enable body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ai',require('./routes/openaiRoutes'));
app.listen(port, () => console.log(`Server started on port ${port}`));

