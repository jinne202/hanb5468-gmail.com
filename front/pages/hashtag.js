import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

const HashTag = ( {tag} ) => {
    const dispatch = useDispatch();
    const { mainPosts } = useSelector(state => state.post);

    useEffect(() => {
        dispatch({
            type : LOAD_HASHTAG_POSTS_REQUEST,
            data : tag,
        });
    }, []);

    return(
        <div>
            {mainPosts.map(c => (
                <PostCard key={+c.createdAt} post={c} />
            ))}
        </div>
    )
}

HashTag.propTypes = {
    tag : PropTypes.string.isRequired,
};

// getInitialProps = 이건 method가 하나 생긴다! 얘는 context라는 매개변수를 받는다 이거 사용하려면 _app.js에서 nodebird getinitialProps를 사용해야한다
HashTag.getInitialProps = async (context) => {
    console.log('hashtag getInitialProps', context.query.tag);
    return { tag : context.query.tag };
};

export default HashTag;