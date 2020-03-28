const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
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
        return next(e);
    }
});

// 멀터를 설정해줌 옵션 살펴보기
const upload = multer({
    storage : multer.diskStorage({ //서버쪽 ssd에다가 저장하겠다
        destination(req, file, done) { //파일이 저장될 위치
            done(null, 'uploads');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname); //확장자 추출
            const basename = path.basename(file.originalname, ext); //확장자 제외한 basename 추출
            done(null, basename + new Date().valueOf() + ext); //파일명이 같더라도 업로드한 시간을 같이 넣어 덮어씌워지지 않게 방지
        },
    }),
    limits : { fileSize : 20 * 1024 * 1024 }, //이미지 업로드 크기 제한
});

router.post('/images', upload.array('image'), (req, res, next) => {
    console.log(req.files);
    res.json(req.files.map(v => v.filename));
});

router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where : { id : req.params.id} });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다');
        }
        const comments = await db.Comment.findAll({
            where : {
                PostId : req.params.id,
            },
            order : [['createdAt', 'ASC']], //오름차순으로 정렬
            include : [{
                model : db.User,
                attributes : ['id', 'nickname'],
            }],
        });
        return res.json(comments);
    } catch (e) {
        console.error(e);
        return next(e);
    }
})

router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where : { id : req.params.id } }); //일단 post가 존재하는지 찾는다
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다');
        }
        const newComment = await db.Comment.create({
            PostId : post.id,
            UserId : req.user.id,
            content : req.body.content,
        });
        await post.addComment(newComment.id);
        const comment = await db.Comment.findOne({
            where : {
                id : newComment.id,
            },
            include : [{
                model : db.User,
                attributes : ['id', 'nickname'],
            }],
        });
        return res.json(comment);
    } catch (e) {
        console.error(e);
        return next(e);
    }
})

module.exports = router;