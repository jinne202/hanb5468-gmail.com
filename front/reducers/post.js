export const initialState = {
    mainPosts : [],
    imagePaths : [],
    addPostErrorReason : false , //포스트 업로드 실패 사유
    isAddingPost : false, //포스트 업로드 중
    postAdded : false, //포스트 업로드 성공
    isAddingComment : false,
    addCommentErrorReason : '',
    commentAdded : false,
};

export const LOAD_MAIN_POST_REQUEST = 'LOAD_MAIN_POST_REQUEST';
export const LOAD_MAIN_POST_SUCCESS = 'LOAD_MAIN_POST_SUCCESS';
export const LOAD_MAIN_POST_FAILURE = 'LOAD_MAIN_POST_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_USER_POST_REQUEST = 'LOAD_USER_POST_REQUEST';
export const LOAD_USER_POST_SUCCESS = 'LOAD_USER_POST_SUCCESS';
export const LOAD_USER_POST_FAILURE = 'LOAD_USER_POST_FAILURE';

export const UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST';
export const UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS';
export const UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE'

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const LOAD_COMMENT_REQUEST = 'LOAD_COMMENT_REQUEST';
export const LOAD_COMMENT_SUCCESS = 'LOAD_COMMENT_SUCCESS';
export const LOAD_COMMENT_FAILURE = 'LOAD_COMMENT_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';


const addPost = {
    type : ADD_POST_REQUEST,
}

const reducer = (state = initialState, action) => {
    switch (action.type){
        case ADD_POST_REQUEST : {
            return {
                ...state,
                isAddingPost : true,
                addPostErrorReason : '',
                postAdded : false,
            }
        }
        case ADD_POST_SUCCESS : {
            return {
                ...state,
                isAddingPost : false,
                mainPosts : [action.data, ...state.mainPosts],
                postAdded : true,
            }
        }
        case ADD_POST_FAILURE : {
            return {
                ...state,
                isAddingPost : false,
                addPostErrorReason : action.error,
            }
        }
        case ADD_COMMENT_REQUEST : {
            return {
                ...state,
                isAddingComment : true,
                addCommentErrorReason : '',
                commentAdded : false,
            }
        }

        case ADD_COMMENT_SUCCESS : {
            const postIndex = state.mainPosts.findIndex(v => v.id === action.data.postId);
            const post = state.mainPosts[postIndex];
            const Comments = [...post.Comments, action.data.comment];
            const mainPosts = [...state.mainPosts];
            mainPosts[postIndex] = {...post, Comments};
            return {
                ...state,
                isAddingComment : false,
                mainPosts,
                commentAdded : true,
            }
        }
        case ADD_COMMENT_FAILURE : {
            return {
                ...state,
                isAddingComment : false,
                addCommentErrorReason : action.error,
            }
        }
        case LOAD_MAIN_POST_REQUEST :
        case LOAD_HASHTAG_POSTS_REQUEST :
        case LOAD_USER_POST_REQUEST : {
            return {
                ...state,
                mainPosts : [],
            }
        }
        case LOAD_MAIN_POST_SUCCESS :
        case LOAD_HASHTAG_POSTS_SUCCESS :
        case LOAD_USER_POST_SUCCESS : {
            return {
                ...state,
                mainPosts : action.data,
            }
        }
        case LOAD_MAIN_POST_FAILURE :
        case LOAD_HASHTAG_POSTS_FAILURE :
        case LOAD_USER_POST_FAILURE : {
            return {
                ...state,
            }
        }
        default : {
            return {
                ...state,
            }
        }
    }
}

export default reducer;