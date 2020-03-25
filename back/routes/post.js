const express = require('express');
const db = require('../models');
const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s]+/g);
        const newPost = await db.Post.create({
            content : req.body.content,
            UserId : req.user.id,
        });
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ //findOrCreate는 없으면 만들고 있으면 찾고
                where : { name : tag.slice(1).toLowerCase() },
            })));
            console.log(result);
            // post에 해쉬태그 만든 것들을 연결해준다
            await newPost.addHashtags(result.map(r => r[0]));
        }
        const fullPost = await db.Post.findOne({
            where : { id : newPost.id },
            include: [{
                    model: db.User,
            }],
        });
        res.json(fullPost);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/images', (req, res) => {

});

module.exports = router;