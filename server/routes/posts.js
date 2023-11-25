import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken , getFeedPosts); // home page has all posts so it takes all post
router.get
/* UPDATE */
export default router
