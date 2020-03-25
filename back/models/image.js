module.exports = (sequelize, DataTypes) => {
    // User이란 테이블 명
    const Image = sequelize.define('Image', {
        // src는 이미지 경로
        src : {
            type : DataTypes.STRING(200), //긴 글은 TEXT로
            allowNull : false, // 필수! allowNull true는 선택
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        //한글이 저장됨
    });

    Image.associate = (db) => {
        // 이미지는 게시글에게 속해있다
        db.Image.belongsTo(db.Post);
    };

    return Image;
};