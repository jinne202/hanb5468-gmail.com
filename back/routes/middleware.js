exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).send('로그인이 필요합니다');
    }
}
// 공통적인 것들은 middleware로 빼준다 (중복 제거)

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        return res.status(401).send('로그인한 사용자는 접근할 수 없습니다');
    }
}