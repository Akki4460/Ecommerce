// npm install  body-parser express mongoose jsonwebtoken nodemailer nodemon cors
// This above dependencies are required for backend setup


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");


// mongodb+srv://akki10:<password>@clusterlft1.g6q2qdt.mongodb.net/

// Used because nospecial characters will work
const password = encodeURIComponent("Akki@9590");

// mongodb+srv://akki10:<password>@clusterlft1.g6q2qdt.mongodb.net/
mongoose.connect(`mongodb+srv://akki10:${password}@clusterlft1.g6q2qdt.mongodb.net/`, {
    // useNewUrlParser:true,
    // useUnifiedTopology:true
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log("Error connecting to MongoDB", err)
});

app.listen(port, () => {
    console.log("Server is running on 8000")
});


const User = require("./models/user")
const Order = require("./models/order")


// Function to send verification email to user
const sendVerificationEmail = async (email, verificationToken) => {

    // Create a nodemailer to transport
    const transporter = nodemailer.createTransport({

        // Configure the email service
        service: "gmail",
        auth: {
            user: "ikkaincognito01@gmail.com",
            pass: "cvasoazcgmuvlxec"
        }
    })

    // Compose the email message
    const mailOptions = {
        from: "Lucifer fashion & trends",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://192.168.1.10:8000/verify/${verificationToken}`
    }

    // send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully")
    } catch (err) {
        console.log("Error sending verification email", err);
    }
}




// Endpoint to register in app
app.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        const newUser = new User({ name, email, password });


        // Generate and store verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");         // Generating random token using crypto


        // Save the user to database
        await newUser.save();


        // Send verification mail to user
        sendVerificationEmail(newUser.email, newUser.verificationToken);

    } catch (err) {
        console.log("Error registering user", err);
        res.status(500).json({ message: "Registration failed" })
    }
})


// Endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
    try {

        const token = req.params.token


        // Find user with given verification token
        const user = await User.findOne({ verificationToken: token });
        if (!User) {
            return res.status(400).json({ message: "Invalid verification token" })
        }

        // Mark the user that verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully" })

    } catch (err) {
        res.status(500).json({ message: "Email Verification failed" })
    }
})


// generating secret key for token
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex")

    return secretKey
}
const secretKey = generateSecretKey()


// Endpoint to login the user!
app.post("/login", async (req, res) => {
    try {


        const { email, password } = req.body;

        // Check if user already exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "email or password not found" })
        }

        // Check if password is correct
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" })
        }

        // Generate a token
        const token = jwt.sign({ userId: user._id }, secretKey)

        res.status(200).json({ token })


    } catch (err) {
        res.status(500).json({ message: "Login Failes" })
    }
})

// Endpoint to store new address to backend
app.post("/addresses", async (req, res) => {
    try {
        const { userId, address } = req.body;

        // find the user by Userid
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        // Add the new address to the user's addresses array
        user.addresses.push(address);

        // save the updated user in the backend
        await user.save();

        res.status(200).json({ message: "Adress created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error adding address" });
    }
})

//Endpoint to get all the addresses of a particular user
app.get("/addresses/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const addresses = user.addresses;
      res.status(200).json({ addresses });
    } catch (error) {
      res.status(500).json({ message: "Error retrieveing the addresses" });
    }
  });

//Endpoint to store all the orders
app.post("/orders", async (req, res) => {
    try {
      const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } =
        req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      //create an array of product objects from the cart Items
      const products = cartItems.map((item) => ({
        name: item?.title,
        quantity: item.quantity,
        price: item.price,
        image: item?.image,
      }));
  
      //create a new Order
      const order = new Order({
        user: userId,
        products: products,
        totalPrice: totalPrice,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      });
  
      await order.save();
  
      res.status(200).json({ message: "Order created successfully!" });
    } catch (error) {
      console.log("error creating orders", error);
      res.status(500).json({ message: "Error creating orders" });
    }
  });


//Endpoint to get the user profile
app.get("/profile/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving the user profile" });
    }
  });
  
// For profile screen
  app.get("/orders/:userId",async(req,res) => {
    try{
      const userId = req.params.userId;
  
      const orders = await Order.find({user:userId}).populate("user");
  
      if(!orders || orders.length === 0){
        return res.status(404).json({message:"No orders found for this user"})
      }
  
      res.status(200).json({ orders });
    } catch(error){
      res.status(500).json({ message: "Error"});
    }
  })
  