import User from "../models/user.mode..js";
import Post from "../models/post.model.js"
import Notification from "../models/notification.model.js"
import {v2 as cloudinary} from "cloudinary"

export const createPost=async (req,res)=>{
    try {
        const {text}=req.body;
        let {img}=req.body;
        const userId=req.user._id.toString();

        const user =await User.findById(userId);
        if(!user) return res.status(400).json({message:"User not found "});

        if(!text && !img){
            return res.status(400).json({error:"Post must have text or image"});
        }

        if(img){
            const uploadedResponse =await cloudinary.uploader.upload(img);
            img=uploadedResponse.secure_url;
        }

        const newPost =new Post({
            user:userId,
            text,
            img
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({error:"Internal sercer error "});
        console.log("errror in createpost controller",error);
    }
};

export const deletePost=async (req,res)=>{
    try {
        const post =await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error:"Post not found"});
        }
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"You are not autjenciated user to delete a post"})
        }
        if(post.img){
            const imgId =post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Post deleted succesfully"});

    } catch (error) {
        res.status(500).json({error:"Internal sercer error "});
        console.log("errror in deletePost controller",error);
    }
};

export const commentOnPost= async (req,res)=>{
    try {
        const {text}=req.body;
        const postId=req.params.id;
        const userId=req.user._id;
        if(!text){
            return res.status(400).json({error:"text field is required"});
        }
        const post =await Post.findById(postId);
        if(!post){
            return res.status(404).json({error:"post not found"});
        }
        const comment ={user:userId ,text};
        post.comments.push(comment);
        await post.save();
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({error:"Internal sercer error "});
        console.log("errror in comment on post controller",error);
    }
};

export const likeunlikePost= async (req,res)=>{
    try {
        const userId=req.user._id;
        const {id:postId}=req.params;
        const post =await Post.findById(postId);
        if(!post){
            res.status(404).json({error:"Post not found"});
        }
        const userLikePost =post.likes.includes(userId);
        if(userLikePost){
            //unlike functionality;
            await Post.updateOne({_id:postId},{$pull:{likes:userId}});
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}});
            res.status(200).json({message:"Post unlike succesfully"});
        }
        else{
            //like functionality
            post.likes.push(userId);
            await User.updateOne({_id:userId},{$push:{likedPosts:postId}});
            await post.save();
            const notification = new Notification({
                from:userId,
                to:post.user,
                type:"like"
            })
            await notification.save();
            res.status(200).json({message:"Post liked successfully"});
        }

    } catch (error) {
        res.status(500).json({error:"Internal sercer error "});
        console.log("errror in like unlike  on post controller",error);
    
    }
};

export const getAllPosts= async (req,res)=>{
    try {
        // const posts = await Post.find().sort({createdAt:-1}).populate("user").select("-password");//it gives latest post
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:"-password"
        }).populate({
            path:"comments.user",
            select:"-password"
        })
        if(posts.length === 0){
            return res.status(200).json([]);
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error:"Internal sercer error "});
        console.log("errror in getting all the post controller",error);
    }
};

export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getFollowingPosts = async (req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({error:"user not found"});

        const following =user.following;
        const feedPosts = await Post.find({user:{$in:following}}).sort({createdAt:-1})
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });

    res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getfollowingpost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserPosts=async (req,res)=>{
    // const username=req.params;
    try {
        const {username} =req.params;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({error:"user not found"});
        const posts = await Post.find({user:user._id}).sort({createdAt:-1})
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });

    res.status(200).json(posts);

    } catch (error) {
        console.log("Error in getUserpost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
}