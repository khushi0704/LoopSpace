import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// const Token = require("../models/token.js");
import token from "../models/token.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
/* REGISTER USER */
export const register = async (req, res) => {
  console.log("Registering User.....")
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const collegeDomain = "juetguna.in";
    const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${collegeDomain}$`);

    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email domain" });
    }

    // password encryption
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    // save user to mongodb
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    // token generation
    console.log("Generating token for user ....")
    const Token =  new token({
      userId: savedUser._id,
      token: crypto.randomBytes(32).toString("hex")
    })
    
    await Token.save();

    console.log("Token is generated successfully and saved in db.")
    // creating a verify link
    // const url = `${process.env.BASE_URL}users/${savedUser._id}/verify/${Token.token}`
    const url = `http://localhost:3001/users/${savedUser._id}/verify/${Token.token}`
    console.log("URL: " , url)
    console.log("Verifying user....")
    await sendEmail(savedUser.email,"Verify Email", url);
    console.log("User verified successfully.")
    res.status(201).json(savedUser);
    // 
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // check credentials
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    if(!user.verified){
      let Token = await token.findOne({userId: user._id});
      if(!Token){
        Token = await new token({
          userId: user._id,
          Token:crypto.randomBytes(32).toString("hex")          
        }).save();
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${Token.token}`
        await sendEmail(user.email,"Verify Email",url);
      }
      return res.status(400).send({message:'An email sent to your account'});
    }
    // check token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};