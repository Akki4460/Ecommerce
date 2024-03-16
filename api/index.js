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


const User = require("./models/user")
const Order = require("./models/order")


// Function to send verification email to user
const sendVerificationEmail = async (email,verificationToken) => {

    // Create a nodemailer to transport
    const transporter = nodemailer.createTransport({

        // Configure the email service
        service:"gmail",
        auth:{
            user:"akkilapy07@gmail.com",
            pass:"Akki@727212"
        }
    })

    // Compose the email message
    const mailOptions={
        from:"Lucifer fashion & trends",
        to:email,
        subject:"Email Verification",
        text:`Please click the following link to verify your email: https://localhost:8000/verify/${verificationToken}`
    }

    // send the email
    try{
        await transporter.sendMail(mailOptions);
    }catch(err){
        console.log("Error sending verification email",err);
    }
}




// Endpoint to register in app
app.post("/register",async(req,res)=>{
    try{

        const {name,email,password} = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already registered"});
        }

        // Create new user
        const newUser = new User({name,email,password});


        // Generate and store verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");         // Generating random token using crypto


        // Save the user to database
        await newUser.save();


        // Send verification mail to user
        sendVerificationEmail(newUser.email, newUser.verificationToken);

    }catch(err){
        console.log("Error registering user",err);
        res.status(500).json({message:"Registration failed"})
    }
})


// Endpoint to verify the email
app.get("/verify/:token",async(req,res)=>{
    try{
        
        const token = req.params.token


        // Find user with given verification token
        const user = await User.findOne({verificationToken: token});
        if(!User){
            return res.status(400).json({message:"Invalid verification token"})
        }

        // Mark the user that verified
        user.verified=true;
        user.verificationToken=undefined;

        await user.save();

        res.status(200).json({message:"Email verified successfully"})

    }catch(err){
        res.status(500).json({message:"Email Verification failed"})
    }
})