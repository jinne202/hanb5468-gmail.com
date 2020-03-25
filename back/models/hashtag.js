module.exports = (sequelize, DataTypes) => {
    // User이란 테이블 명
    const Hashtag = sequelize.define('Hashtag', {
        name : {
            type : DataTypes.STRING(20),
            allowNull : false, // 필수! allowNull true는 선택
        },
    }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        //한글이 저장됨
    });

    Hashtag.associate = (db) => {
        // 해시태그는 다대다 관계이다 이런 애들은 belongsToMany를 사용한다! 그리고 through를 사용해서 적어줌
        db.Hashtag.belongsToMany(db.Post, { through : 'PostHashtag' });
    };

    return Hashtag;
};