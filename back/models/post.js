module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', { //테이블명 posts
        content : {
            type : DataTypes.TEXT, //긴 글은 TEXT로
            allowNull : false, // 필수! allowNull true는 선택
        },
    }, {
        charset: 'utf8mb4', //한글에 이모티콘까지
        collate: 'utf8mb4_general_ci',
        //한글이 저장됨
        // tableName : 'posts', //이렇게 테이블명을 적어줘도 됨
    });

    Post.associate = (db) => {
        // 연결되는 부분들을 여기에 저장할 예정 belongsTo는 사용자에게 속해있다라는 뜻 hasMany는 게시글이 이미지나 댓글을 많이 갖고 있다
        db.Post.belongsTo(db.User); //뒤에 id 붙여서 테이블에 UserId 컬럼이 생김! post는 user에게 속해있다!
        db.Post.hasMany(db.Comment); //게시글은 댓글을 많이 가지고 있다
        db.Post.hasMany(db.Image);
        db.Post.belongsTo(db.Post, { as : 'Retweet' }); //리트윗 관계 둘 다 Post라 이름 구별 안 갈때는 as로 이름을 지어준다!!!! RetweetId 컬럼이 생김
        db.Post.belongsToMany(db.Hashtag, { through : 'PostHashtag' });
        db.Post.belongsToMany(db.User, { through : 'Like', as : 'Likers' }); //좋아요 눌러주기
    };

    return Post;
};