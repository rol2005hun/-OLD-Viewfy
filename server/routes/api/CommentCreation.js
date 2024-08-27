const express = require('express');
const router = express.Router();
const Comment = require('../../model/Comment');
const Post = require('../../model/Post');
const {commentValidation} = require('../../validation/validation');

// összes komment lekérése
router.get('/comment', async (req, res) => {
    try {
        const comments = await Comment.find().sort({date: -1});
        return res.json({
            comments: comments
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
})

// egy megadott komment lekérése
router.get('/comment/comment-id/:id', async (req, res) => {
    try {
        const comment = await Comment.find({_id: {$eq: req.params.id}}).sort({date: -1});
        return res.json({
            comment: comment
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
})

// egy poszt kommentjének lekérése
router.get('/comment/post-id/:id', async (req, res) => {
    try {
        const comments = await Comment.find({postId: {$eq: req.params.id}}).sort({date: -1});
        return res.json({
            comments: comments
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
})

// komment törlése
router.delete('/comment/comment-id/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete({_id: req.params.id})

        const post = await Post.findById({_id: comment.postId})
        const index = post.comments.indexOf(req.params.id);
        if (index > -1) {
            post.comments.splice(index, 1);
            await post.save();
        }

        return res.json({
            id: comment._id,
            name: comment.name,
            status: 'Sikeres törlés.'
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
})

// komment frissítés
router.patch('/comment/comment-id/:id', async (req, res) => {
    const commentToUpdateUsersRated = await Comment.findOne({_id: req.params.id});
    if(commentToUpdateUsersRated.usersRated.includes(req.body.userRated)) {
        res.status(404).send('Te már értékelted a hozzászólást.');
    } else {
        try {
            const comment = await Comment.findOneAndUpdate({_id: req.params.id}, {$set: req.body});

            commentToUpdateUsersRated.usersRated.push(req.body.userRated);
            await commentToUpdateUsersRated.save();

            return res.json({
                status: 'Sikeres frissítés.',
                comment: comment
            });

        } catch (err) {
            res.status(404).send(err.message);
        }
    }
})

// komment készítés
router.post('/comment/post-id/:id', async (req, res) => {
    const {error} = commentValidation(req.body);
    if (error) {
        return res.status(404).json({
            success: false,
            msg: 'Your ' + error.details[0].message
        });
    }

    const post = await Post.findById({_id: req.params.id})

    const newComment = new Comment({
        comment: req.body.comment,
        upvotes: req.body.upvotes,
        downvotes: req.body.downvotes,
        ownerName: req.body.ownerName,
        ownerId: req.body.ownerId,
        postId: post._id
    });
    try {
        // newComment.usersRated.push(req.body.userRated);
        // új komment elmentése
        newComment.save().then(comment => {
            console.log(comment);
            return res.status(201).json({
                success: true,
                msg: 'Sikeres hozzászólás.',
                comment: comment
            });
        });

        post.comments.push(newComment);
        await post.save();
    } catch (err) {
        res.status(404).send(err);
    }
})


module.exports = router;