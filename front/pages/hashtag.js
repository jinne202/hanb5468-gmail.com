import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../components/PostCard';

// const HashTag = ({ tag }) => {
//     console.log(tag);
//     const dispatch = useDispatch();
//     const { mainPosts } = useSelector(state => state.post);

//     useEffect(() => {
//         dispatch({
//             type : LOAD_HASHTAG_POSTS_REQUEST,
//             data : tag,
//         });
//     }, []);

//     return (
//         <div>
//             {mainPosts.map(c => (
//                 <PostCard key={+c.createdAt} post={c} />
//             ))}
//         </div>
//     );
// };

const HashTag = () => {
    return(
        <div>
            hashtag
        </div>
    )
}

HashTag.propTypes = {
    tag : PropTypes.string.isRequired,
};

HashTag.getInitialProps = async (context) => {
    console.log('hashtag getInitialProps', context.query.tag);
    return { tag : context.query.tag };
};

export default HashTag;