import express from "express";
//import Token from "../models/token.js";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    token_verification
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id/verify/:token", token_verification);
router.get("/:id", verifyToken, getUser);

router.get("/:id/friends", verifyToken, getUserFriends);
console.log("working till here");



/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
export default router;
