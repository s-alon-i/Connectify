import PostSchema from '../models/postModel.js'
import mongoose from 'mongoose'

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1)                 // get the starting index of every page
        const total = await PostSchema.countDocuments({})     // it will count the total number of documents/ posts in our database

        // sort() --> sort the post Newer will come first then previous
        // limit() --> will give the no. of post we want
        // skip() --> suppose I am on page 2 then it skip the posts of previous page start from the index of 2nd page
        const posts = await PostSchema.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)
        
        // console.log(posts)
        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error })
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostSchema.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostSchema({ ...post, creator: req.userId, createdAt: new Date().toISOString() })
    
    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostSchema.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostSchema.findByIdAndRemove(id);
    res.json({ message: "Note deleted successfully." });
}


// Query -> '/posts?page=1' -> page=1
// Params -> /posts/:id  --> /posts/123   (id -> 123)
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostSchema.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ error });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await PostSchema.find({ name });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: "Unauthticated" })

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostSchema.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) post.likes.push(req.userId);                  // --- Like the post ----
    else post.likes = post.likes.filter((id) => id !== String(req.userId))  // --- Dislike the post -----

    const updatedPost = await PostSchema.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostSchema.findById(id);

    post.comments.push(value);

    const updatedPost = await PostSchema.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};