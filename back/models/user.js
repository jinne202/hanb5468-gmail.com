module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //테이블명은 자동으로 user가 됨
        // 사용자에는 닉네임, 아이디, 비밀번호가 필요
        nickname : {
            type : DataTypes.STRING(20),
            allowNull : false, // 필수라는 뜻
        },
        userId : {
            type : DataTypes.STRING(20),
            allowNull : false,
            unique : true, //고유한 값 아이디는 고유한 값이어야 한다
        },
        password : {
            type : DataTypes.STRING(100),
            allowNull : false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        //한글이 저장됨
    });

    User.associate = (db) => {
        // 연결되는 부분들을 여기에 저장할 예정 한 명이 여러개를 쓸 수 있을 때는 hasmany / 서로 교류해야하는 경우는 belongsToMany
        db.User.hasMany(db.Post, { as : 'Posts' });
        db.User.hasMany(db.Comment);
        // as로 구별 구별 ^.^ belongsToMany는 되도록 as를 다 달아두도록 하자
        db.User.belongsToMany(db.Post, { through : 'Like', as : 'Liked' });
        // foreignKey - db에서 구별하는 id
        db.User.belongsToMany(db.User, { through : 'Follow', as : 'Followers', foreignKey: 'followingId' });
        db.User.belongsToMany(db.User, { through : 'Follow', as : 'Followings', foreignKey: 'followerId'});
    };

    return User;
}