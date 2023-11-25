import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; //Allow us to set path when we configure directory
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users,posts} from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(bodyParser.json({limit: "30mb",extended:true}));
app.use(bodyParser.urlencoded({limit: "30mb",extended:true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); //Where we store our images or assets.
 
/* file storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/assets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
  });

const upload = multer({ storage });
/* ROUTES WITH FILES */
app.post("/auth/register" , upload.single("picture"), register); // upload a picture locally in public/assets folder
app.post("/posts", verifyToken, upload.single("picture"),createPost);


/* routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URL ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    /* ADD DATA ONE TIME */
    /* SO AFTER ONE RUNTIME , THE INFORMATION IS UPDATED IN THE MONGODB DATABASE */
  //  User.insertMany(users);
  //  Post.insertMany(posts);


}).catch((error)=> console.log(`${error} did not connect`));
// authentication or autorization : only loggedin users can use the app
// only after id pass auth , they can access login to website


