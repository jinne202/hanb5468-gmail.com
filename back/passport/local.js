const passport = require('passport');
const { Strategy : LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField : 'userId',
        passwordField : 'password',
    }, async (userId, password, done) => {
        try {
            // 기존 사용자가 있는가?:
            const user = await db.User.findOne({ where : { userId }});
            // 없으면
            if (!user) {
                // done(null자리에는 이건 서버쪽 에러라서 1을 넣어주고, 두 번째는 성공했을 때, 3은 로직 오류라서 강제로 로그인 프로세스를 중단해야할 때 사용 )
                return done(null, false, { reason : '존재하지 않는 사용자입니다' });
            }
            // 비밀번호가 맞는가?
            const result = await bcrypt.compare(password, user.password); //(사용자가 입력한 패스워드, db에 입력된 패스워드) compare은 bcrypt에서 제공하는 메서드
            // 일치한다
            if (result) {
                return done(null, user); //성공했을 때는 user 자리에 성공 인자를 넣어준다
            }
            // 일치하지 않는다
            return done(null, false, { reason : '비밀번호가 틀립니다' });
        } catch (e) {
            console.error(e);
            return done(e);
        }
    }));
};