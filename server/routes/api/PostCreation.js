const express = require('express');
const router = express.Router();
const Post = require('../../model/Post');
const User = require('../../model/User');
const { postValidation } = require('../../validation/validation');


// poszt készítés
router.post('/post/user-id/:id', async(req, res) => {
    const { error } = postValidation(req.body);
    if(error) {
        return res.status(404).json({
            success: false,
            msg: 'Your ' + error.details[0].message
        });
    }

    const user = await User.findById({_id: req.params.id})

    const newPost = new Post({
        name: req.body.name,
        description: req.body.description,
        privacy: req.body.privacy,
        image: req.body.image,
        ownerId: user._id,
        ownerName: user.username
    });

    try {
        // poszt elmentése
        newPost.save().then(post => {
            console.log(post);
            return res.status(201).json({
                success: true,
                msg: 'Sikeres bejegyzés.',
                post: post
            });
        });

        user.posts.push(newPost);
        await user.save();
    } catch(err) {
        res.status(404).send(err);
    }
})

/**
 * @route POST api/PostCreation/Profile
 * @desc A bejegyzés adatait adja vissza
 * @access Private
 */

// poszt lekérése
router.get('/post',  async (req, res) => {
    const posts = await Post.find();
    return res.json({
        posts: posts
    });
})

// poszt lekérése felhasználóid alapján
router.get('/post/user-id/:id',  async (req, res) => {
    const posts = await Post.find({ownerId: req.params.id});
    return res.json({
        posts: posts
    });
})

// megadott poszt lekérése
router.get('/post/post-id/:id',  async (req, res) => {
    try {
        const post = await Post.findById({_id: req.params.id})
        return res.json({
            post: post
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

// poszt törlése
router.delete('/post/post-id/:id',  async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete({_id: req.params.id})
        return res.json({
            id: post._id,
            name: post.name,
            status: 'Sikeres törlés.'
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

// poszt frissítés
router.patch('/post/post-id/:id', async (req, res) => {
    try {
        const post = await Post.updateOne({_id: req.params.id}, {$set: req.body});
        return res.json({
            status: 'Sikeres frissítés.'
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

// random poszt lekérése
router.get('/post/random', async(req, res) => {
    try {
        const count = await Post.countDocuments();
        const random = Math.floor(Math.random() * count);
        const post = await Post.findOne().skip(random);
        return res.json({
            post: post
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

module.exports = router;