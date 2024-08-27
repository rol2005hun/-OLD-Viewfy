const express = require('express');
const router = express.Router();
const Comment = require('../../model/Comment');
const Reply = require('../../model/Reply');
const { replyValidation } = require('../../validation/validation');

// összes válasz lekérése
router.get('/reply', async(req, res) => {
    try {
        const replies = await Reply.find().sort({date: -1});
        return res.json({
            replies: replies
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

// összes válasz lekérése commentid alapján
router.get('/reply/comment-id/:id', async(req, res) => {
    try {
        const replies = await Reply.find({commentId: {$eq: req.params.id}}).sort({date: 1});
        return res.json({
            replies: replies
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

// válasz törlés
router.delete('/reply/reply-id/:id',  async (req, res) => {
    try {
        const post = await Reply.findByIdAndDelete({_id: req.params.id})
        return res.json({
            id: post._id,
            name: post.name,
            status: 'Successfully deleted'
        });
    } catch(err) {
        res.status(404).send(err.message);
    }
})

// válasz frissítés
router.patch('/reply/reply-id/:id', async (req, res) => {
    const replyToUpdateUsersRated = await Reply.findOne({_id: req.params.id});
    if(replyToUpdateUsersRated.usersRated.includes(req.body.userRated)) {
        res.status(404).send('Sorry, you have already rated');
        console.log('Sorry, you have already rated');
    } else {
        try {
            const reply = await Reply.findOneAndUpdate({_id: req.params.id}, {$set: req.body});

            replyToUpdateUsersRated.usersRated.push(req.body.userRated);
            await replyToUpdateUsersRated.save();

            return res.json({
                status: 'Successfully patched',
                reply: reply
            });

        } catch (err) {
            res.status(404).send(err.message);
        }
    }
})

// válasz készítés
router.post('/reply/comment-id/:id', async(req, res) => {
    const { error } = replyValidation(req.body);
    if(error) {
        return res.status(404).json({
            success: false,
            msg: 'Your ' + error.details[0].message
        });
    }

    const comment = await Comment.findById({_id: req.params.id})

    const newReply = new Reply({
        reply: req.body.reply,
        upvotes: req.body.upvotes,
        downvotes: req.body.downvotes,
        ownerName: req.body.ownerName,
        ownerId: req.body.ownerId,
        commentId: comment._id
    });
    try {
        // uj válasz mentése
        newReply.save().then(reply => {
            console.log(reply);
            return res.status(201).json({
                success: true,
                msg: 'Sikeres válasz.',
                reply: reply
            });
        });

        comment.replies.push(newReply);
        await comment.save();
    } catch(err) {
        res.status(404).send(err);
    }
})

module.exports = router;