module.exports = (sequelize, DataTypes) => {
    // User이란 테이블 명
    const Comment = sequelize.define('Comment', {
        content : {
            type : DataTypes.TEXT, //긴 글은 TEXT로
            allowNull : false, // 필수! allowNull true는 선택
        },
    }, {
        charset: 'utf8mb4', //한글에 이모티콘까지
        collate: 'utf8mb4_general_ci',
        //한글이 저장됨
    });

    Comment.associate = (db) => {
        // 댓글은 user와 post에 속해있다
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };

    return Comment;
};