const path = require("path");
const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;

const cors = require('cors');

const app = express();

app.use(cors()); // Enable CORS for all routes


//Enable body Parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ai',require('./routes/openaiRoutes'));
app.use('/proxy', require('./routes/proxyRoutes'));

app.listen(port, () => console.log(`Server started on port ${port}`));

