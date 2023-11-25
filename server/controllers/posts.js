import Post from "../models/Post.js";

/* CREATE */
export const createPost = async (req, res) =>{
  try{
     const { userId, description,picturePath} = req.body;
     const user = await User.findById(userId);
     const newPost = new Post({
        firstName: user.firstName,
        lastName: user.lastName,
        location : user.location,
        description,
        userPicturePath: user.userPicturePath,
        picturePath,
        likes: {
            // someid: true
        }, // empty object starts with zero likes
        comments:[],
     })
    await newPost.save(); // save to mongodb
    const post = await Post.find(); //grabs all posts and return
 // news feed updated with the new post 
    res.status(201).json(post);
  }
  catch(err){
    res.status(409).json({message : err.message});
  }
}

// update frontend according to backend 
// so backend is created first and then frontend
// hard part : dealing with api , how youre sending grabbing and dealing with it 

/* READ */
export const getFeedPosts = async(req,res) => {
    try{
        const post = await Post.find();
        res.status(201).json(post);
    }
    catch(err){
        res.status(404).message({message : err.message});
    }
}
// grab user feed posts 
// just sending the user id 
export const getUserPosts = async (req,res) =>{
    try{
     const {userId} = req.params;
     const post = await Post.find({ userId});
     res.status(200).json(post);
    }
    catch(err){
     res.status(404).json({message: err.message});
    }
}

/* UPDATE */
export const likePost = async (req,res) =>{
    try{
        const {id} = req.params; // grab the post
        const {userId} = req.body; // grab the user
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked){
            post.likes.delete(userId);
        }
        else{
            post.likes.set(userId, true);
        }
        // for updating frontend when hitting like
        const updatedPost = await Post.findByIdAndUpdate(
                id,
                { likes: post.likes }, // list of likes we modified
                {new : true}
        );
        res.status(200).json(updatedPost);
       }
       catch(err){
        res.status(404).json({message: err.message});
       }
}