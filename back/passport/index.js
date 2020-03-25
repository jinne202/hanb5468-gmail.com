const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    // 사용자가 로그인하면 세션에 저장 userId 말고도 기본 id가 하나씩 부여되어 있음
    passport.serializeUser((user, done) => { //서버쪽에 [{id : 3, cookie : 'asdff'}] 배열로 이렇게 쿠키를 보내면 이걸 저장함 cookie와 연결된 id만 저장되는데 가볍게 만드는게 목적!
        return done(null, user.id);
    });
    // 그 id를 토대로 불러오는게 디시리얼라이즈
    passport.deserializeUser(async(id, done) => {
        try {
            const user = await db.User.findOne({
                where : { id },
                // include : [{
                //     model : db.Post,
                //     as : 'Posts',
                //     attributes : ['id'],
                // }, {
                //     model : db.User,
                //     as : 'Followings',
                //     attributes : ['id'],
                // }, {
                //     model : db.User,
                //     as : 'Followers',
                //     attributes : ['id'],
                // }],
            });
            return done(null, user); //req.user 불러온 사용자 정보가 여기에 저장됨
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });
    local();
};

// 이게 쿠키랑 세션으로 로그인 하는 방법
// 프론트에서 서버로는 cookie만 보낸다 (asdff) - 누구껀지 모른다 보안이 높음
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id : 3 발견
// id 3이 deserializeUser에 들어가서 req.user로 사용자 정보가 들어간다
// 요쳥을 보낼 때 마다 deserializeUser이 실행되고 실무에선 deserializeUser 결과를 캐싱한다