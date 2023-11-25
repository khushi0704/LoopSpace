import User from "../models/User.js";
import Token from "../models/token.js";

/* READ */
export const getUser = async (req,res) =>{
    try{
     const { id } = req.params;
     const user =await User.findById(id);
     res.status(200).json(user);
    }
    catch{
        res.status(404).json({message: error.message});
    }
}
export const getUserFriends = async ( req,res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
    
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id,firstName, lastName, occupation, location, picturePath})=>{
                return {_id,firstName, lastName, occupation, location, picturePath};
            }
        );
        res.status(200).json(formattedFriends);
    }
   catch(err){
      res.status(404).json({message : err.message});
   }
}

/* UPDATE */
export const addRemoveFriend = async(req, res)=>{
    try{
        const { id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if(user.friends.includes(friendId)){
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id)=> id!== id); // current id is equal to that one so rmeove that 
        }
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)) // call each user
        );
        const formattedFriends = friends.map(
            ({_id,firstName, lastName, occupation, location, picturePath})=>{
                return {_id,firstName, lastName, occupation, location, picturePath};
            }
        );

        res.status(200).json(formattedFriends);

    }
    catch(err){
        res.status(404).json({message : err.message});
    }
}


export const token_verification = async (req, res) => {
    console.log("verifying token .....");
    try {
        console.log("Route is being hit");
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            console.log("error: Invalid Link");
            return res.status(400).send({ message: "Invalid Link" });
        }

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });

        if (!token) {
            return res.status(400).send({ message: "Invalid Link" });
        }

        await User.updateOne({ _id: user._id }, { $set: { verified: true } });
        await token.remove();

        // Send HTML response
        const htmlResponse = `
            <html>
                <head>
                    <title>Verification Successful</title>
                </head>
                <body>
                    <h1>Verification successful!</h1>
                    <p>Your account has been verified.</p>
                </body>
            </html>
        `;

        res.status(200).send(htmlResponse);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}