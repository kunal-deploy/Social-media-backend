import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath, // The path that contains the location of image received in request 
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find();// Returns all the posts available in db and returns them
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();// Returns all the posts available in db and returns them
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });// Returns user posts available in db and returns them
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); // finding if the post is liked by the user of id=userId

    if (isLiked) {
      post.likes.delete(userId);// if it is liked , it means the function was called to unlike and thus remove the id from the post likes
    } else {
      post.likes.set(userId, true);// if it is not liked then it means the function was called to like the post and it will thus be added to likes 
    }

    const updatedPost = await Post.findByIdAndUpdate(// here these are the deatils that will be sent to frontend to update their info which will include the initial id , current state of likes 
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
