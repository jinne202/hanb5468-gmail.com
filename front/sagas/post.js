import { all, fork, takeLatest, delay, put, call } from 'redux-saga/effects'
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE, ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE, LOAD_MAIN_POST_SUCCESS, LOAD_MAIN_POST_FAILURE, LOAD_MAIN_POST_REQUEST, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_HASHTAG_POSTS_REQUEST, LOAD_USER_POST_SUCCESS, LOAD_USER_POST_FAILURE, LOAD_USER_POST_REQUEST, LOAD_COMMENT_SUCCESS, LOAD_COMMENT_FAILURE, LOAD_COMMENT_REQUEST, UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAILURE, UPLOAD_IMAGE_REQUEST } from '../reducers/post';
import axios from 'axios';

function addPostAPI(postData){
    return axios.post('/post', postData, {
        withCredentials : true,
    })
}

function* addPost(action){
    try {
        const result = yield call(addPostAPI, action.data);
        yield put({
            type : ADD_POST_SUCCESS,
            data : result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : ADD_POST_FAILURE,
            error : e,
        });
    }
}

function* watchAddPost(){
    yield takeLatest(ADD_POST_REQUEST, addPost);
}

function loadMainPostsAPI(){
    return axios.get('/posts');
}

function* loadMainPosts(){
    try {
        const result = yield call(loadMainPostsAPI);
        yield put({
            type : LOAD_MAIN_POST_SUCCESS,
            data : result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOAD_MAIN_POST_FAILURE,
            error : e,
        });
    }
}

function* watchLoadMainPosts(){
    yield takeLatest(LOAD_MAIN_POST_REQUEST, loadMainPosts);
}

function loadHashtagPostsAPI(tag){
    return axios.get(`/hashtag/${tag}`);
}

function* loadHashtagPosts(action){
    try {
        const result = yield call(loadHashtagPostsAPI, action.data);
        yield put({
            type : LOAD_HASHTAG_POSTS_SUCCESS,
            data : result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOAD_HASHTAG_POSTS_FAILURE,
            error : e,
        });
    }
}

function* watchLoadHashtagPosts(){
    yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function loadUserPostsAPI(id){
    return axios.get(`/user/${id}/posts`);
}

function* loadUserPosts(action){
    try {
        const result = yield call(loadUserPostsAPI, action.data);
        yield put({
            type : LOAD_USER_POST_SUCCESS,
            data : result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOAD_USER_POST_FAILURE,
            error : e,
        });
    }
}

function* watchLoadUserPosts(){
    yield takeLatest(LOAD_USER_POST_REQUEST, loadUserPosts);
}

function addCommentAPI(data){
    return axios.post(`/post/${data.postId}/comment`, { content : data.content }, {
        withCredentials : true,
    });
}

function* addComment(action){
    try {
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type : ADD_COMMENT_SUCCESS,
            data : {
                postId : action.data.postId,
                comment : result.data,
            },
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : ADD_COMMENT_FAILURE,
            error : e,
        });
    }
}

function* watchAddComment(){
    yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function loadCommentsAPI(postId){
    return axios.get(`/post/${postId}/comments`);
}

function* loadComments(action){
    try {
        const result = yield call(loadCommentsAPI, action.data);
        yield put({
            type : LOAD_COMMENT_SUCCESS,
            data : {
                postId : action.data,
                comments : result.data,
            },
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOAD_COMMENT_FAILURE,
            error : e,
        });
    }
}

function* watchLoadComments(){
    yield takeLatest(LOAD_COMMENT_REQUEST, loadComments);
}

function uploadImagesAPI(formData){
    return axios.post('post/images', formData, {
        withCredentials : true,
    });
}

function* uploadImages(action){
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type : UPLOAD_IMAGE_SUCCESS,
            data : result.data,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : UPLOAD_IMAGE_FAILURE,
            error : e,
        });
    }
}

function* watchUploadImages(){
    yield takeLatest(UPLOAD_IMAGE_REQUEST, uploadImages);
}



export default function* postSaga(){
    yield all ([
        fork(watchAddPost),
        fork(watchLoadMainPosts),
        fork(watchAddComment),
        fork(watchLoadComments),
        fork(watchLoadHashtagPosts),
        fork(watchLoadUserPosts),
        fork(watchUploadImages),
    ]);
}