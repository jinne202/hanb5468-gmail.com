const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.user) {
        return res.status(401).send('로그인이 필요합니다');
    };
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    return res.json(user);
});

router.post('/', async (req, res, next) => { //POST /api/user/ = 회원가입
    try {
        const exUser = await db.User.findOne({ //기존에 가입한 유저가 있는가? findOne - 하나만 찾음
            where : { // 뭘 찾는지! 여기다가 적어준다
                userId : req.body.userId, //요청(req)을 보낼 때 header와 본문(body)를 같이 보낼 수 있는데 본문에 데이터를 넣어 보낸다. 즉 body에 id가 들어있나 찾아봄
            }
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 ID입니다.');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12); //salt는 10~13 사이로
        const newUser = await db.User.create({
            nickname : req.body.nickname,
            userId : req.body.userId,
            password : hashedPassword,
        });
        console.log(newUser);
        return res.status(200).json(newUser);
        // send는 문자열을 보내는 것, json은 json 데이터를 보냄 200번대는 성공 메세지
    } catch (e) {
        console.error(e);
        return next(e);
    }
});

router.get('/:id', (req, res) => { //req.params.id 로 가져올 수 있음 id가 n인 유저정보 가져오겠다 동적으로 변할 수 있는 데이터들!
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

router.post('/login', (req, res, next) => { //passport 전략 여기서 실행
    passport.authenticate('local', (err, user, info) => { //done 해준게 여기로 이어짐 서버 에러 / 유저 정보 / 로직상 에러
        if(err) { //서버 에러 next로 보내버램
            console.error(err);
            return next(err);
        }
        if (info) { //로직상 에러
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            try {
                if (loginErr) {
                    return next(loginErr);
                }
                const fullUser = await db.User.findOne({
                    where : { id : user.id },
                    // 포스팅 수, 팔로워 수 등 로그인한 사용자 정보를 보내면서 팔로잉, 팔로워, 포스트 수 등을 같이 보내기 위해서 include를 사용
                    include : [{
                        model : db.Post,
                        as : 'Posts',
                        // attrbutes 라는 속성으로 필터링 가능
                        attributes : ['id'],
                    }, {
                        model : db.User,
                        as : 'Followings',
                        attributes : ['id'],
                    }, {
                        model : db.User,
                        as : 'Followers',
                        attributes : ['id'],
                    }],
                    // 사용자 정보는 비밀번호를 빼고 보낸다
                    attributes : ['id', 'nickname', 'userId'],
                });
                // const filteredUser = Object.assign({}, user.toJSON()); //여기 user은 passport 폴더의 local 안의 const user 순수한 json으로 만들기 위해 사용
                // delete filteredUser.password;
                console.log(fullUser);
                return res.json(fullUser);
            } catch (e) {
                next(e);
            }
        });
    })(req, res, next);
});

router.get('/:id/follow', (req, res) => {
});

router.post('/:id/follow', (req, res) => {
});

router.delete('/:id/follow', (req, res) => {
});

router.delete('/:id/follower', (req, res) => {
});

router.get('/:id/posts', (req, res) => {
});

module.exports = router;