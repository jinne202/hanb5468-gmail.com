import { all, fork, takeEvery, put, delay, call } from 'redux-saga/effects';
import axios from 'axios'
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, LOG_IN_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST, LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST } from '../reducers/user';

function loginAPI(loginData){
    // 서버에 요청을 보내는 부분
    return axios.post('/user/login', loginData, {
        withCredentials : true,
    });
}

function* login(action){
    try {
        const result = yield call(loginAPI, action.data);
        yield put({
            type : LOG_IN_SUCCESS,
            data : result.data, //axios 응답 정보
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOG_IN_FAILURE,
        });
    }
}

function* watchLogin(){
    yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData){
    return axios.post('/user/', signUpData);
}

function* signUp(action){
    try {
        yield call(signUpAPI, action.data);
        yield put({
            type : SIGN_UP_SUCCESS,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : SIGN_UP_FAILURE,
            error : e,
        });
    }
}

function* watchSignUp(){
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logOutAPI(){
    return axios.post('/user/logout', {}, {
        withCredentials : true,
    });
}

function* logOut(action){
    try {
        yield call(logOutAPI, action.data);
        yield put({
            type : LOG_OUT_SUCCESS,
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOG_OUT_FAILURE,
            error : e,
        });
    }
}

function* watchLogOut(){
    yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI(userId){
    return axios.get( userId ? `/user/${userId}` : '/user/', {
        withCredentials : true,
    });
}

function* loadUser(action){ //자신에 대한 정보 + 남의 정보 같이
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({
            type : LOAD_USER_SUCCESS,
            data : result.data,
            me : !action.data, //action.data가 userId - 만약 userId가 있으면 남, userId가 없으면 내 정보 불러온다
        });
    } catch (e) {
        console.error(e);
        yield put({
            type : LOAD_USER_FAILURE,
            error : e,
        });
    }
}

function* watchLoadUser(){
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga(){
    yield all ([
        fork(watchLogin),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchSignUp),
    ]);
}