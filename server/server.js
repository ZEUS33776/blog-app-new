import express from "express";
import 'dotenv/config';
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import User from "./Schema/User.js";
import cors from 'cors';
import admin from "firebase-admin";
import serviceAccountKey from "./react-blogging-website-719b8-firebase-adminsdk-ccc8d-7b0725841e.json" assert{type:"json"}
import { getAuth } from "firebase-admin/auth"
import aws from "aws-sdk";
import { json } from "express";



const server = express();
const port = 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)

})




let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json())
server.use(cors())

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex:true
})


const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})
const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname:user.personal_info.fullname
    }
}

const generateUserName = async (email) => {
    let username = email.split("@")[0];
    let isUserNameNotUnique=await User.exists({"personal_info.username":username}).then((result)=>result)
    isUserNameNotUnique ? username += nanoid().substring(0,5) : ""
    return username;
}

server.post("/signup",(req,res)=>{
    
    
    // console.log(JSON.stringify(req.body.fullname.fullname))
    let fullname = req.body.fullname.fullname
    let email = req.body.fullname.email
    let password = req.body.fullname.password
    // console.log(fullname,email,password)
   if(fullname.length<3){
    return res.status(403).json({"error":"Fullname must be of length greater than 3"})
   }
   if(!email.length){
    return res.status(403).json({"error":"Enter Email"})
   }
   if(!emailRegex.test(email)){
    return res.status.apply(403).json({"error":"Email is invalid"})
   }
   if(!passwordRegex.test(password)){
    return res.status(403).json({"error":"Not a strong password."})
   }
   bcrypt.hash(password,10,async(err,hashed_password)=>{
    let username=await generateUserName(email);
    let user=new User({
        personal_info:{fullname,email,password:hashed_password,username}
    })
       user.save().then((u) => {
           console.log(u);
        return res.status(200).json({user:formatDatatoSend(u)})
    })
        .catch(err => {
            if (err.code == 11000) {
                return res.status(500).json({ "error": "Email already exists." })
            }
        }
    )
    })

    

   })


   server.post("/signin",async(req,res)=>{
   
    let email = req.body.fullname.email
    let password = req.body.fullname.password
    
       User.findOne({ "personal_info.email": email }).then(
           (user) => {
               if (!user) {
                   return res.status(403).json({ "error": "Email not found" });
               }
               bcrypt.compare(password, user.personal_info.password, (err, result) => {
                   if (err) {
                       return res.status(403).json({ "error": "Error occured while login please try again" });

                   }
                   if (!result) {
                       return res.status(403).json({ "error": "Incorrect password" })
                       
                   }
                   else {
                       return res.status(200).json(formatDatatoSend(user))

                   }
               })
                  
           })
           .catch(err => {
            console.log(err.message);
            return res.status(500).json({"error":err.message})
    })
           
           
       }

    )

    

server.post("/google-auth", async (req, res) => {
    let { access_token } = req.body;

    getAuth().verifyIdToken(access_token)
        .then(async (decodedUser) => {
            let { email, name, picture } = decodedUser;
            picture = picture.replace("s96-c", "s384-c");
            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth ").then((u) => {
                return u||null
            }).catch(err => {
                return res.status(500).json({"error1":err.message})
            })
            if (user) {
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was signed up without google. Please use your email and password to login. " })
                    
                }
            }
                else {
                    let username = await generateUserName(email);
                user = new User({
                    personal_info:{ fullname: name, email, profile_img: picture, username },google_auth:true
                    
                    })
                await user.save().then((u) => {
                    user = u;

                }).catch(err => {
                    return res.status(500).json({"error":err.message})
                })
                
            }
            return res.status(200).json(formatDatatoSend(user))
            
        
        })
        .catch(err => {
            return res.status(500).json({"error":"Failed to authenticate you with google. Try with some other google account"})
    })

   })
//aws image
server.put("/upload-banner", async (req, res) => {
    try {
        const date = new Date();
        const params = {
    
            Bucket: "blog-web-new",
            Key: `${nanoid()}-${date.getTime()}.jpeg`,
            Expires: 60,
            ContentType: 'image/jpeg'
        }
        const url = await (s3.getSignedUrlPromise('putObject', params));
        res.status(200).json({ "url": url });
    }
    catch (error) {
        console.error("Error generating presigned url.", error);
        res.status(500).json({error:"Error generating presigned url."})
    }
    
})

server.listen(port,()=>{
    console.log("Listening on port->"+ port);

})