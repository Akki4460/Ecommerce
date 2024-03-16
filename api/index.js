// npm install  body-parser express mongoose jsonwebtoken nodemailer nodemon cors
// This above dependencies are required for backend setup


const express = require("express");
const bodyParser =  require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");


// mongodb+srv://akki10:<password>@clusterlft1.g6q2qdt.mongodb.net/

// Used because nospecial characters will work
const password = encodeURIComponent("Akki@9590");


mongoose.connect(`mongodb+srv://akki10:${password}@clusterlft1.g6q2qdt.mongodb.net/`,{
    // useNewUrlParser:true,
    // useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err)
});

app.listen(port,()=>{
    console.log("Server is running on 8000")
});


// Endpoint to register in app