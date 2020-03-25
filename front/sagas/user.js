import { all, fork, takeEvery, put, delay, call } from 'redux-saga/effects';
import axios from 'axios'
import { LOG_IN_SUCCESS, LOG_IN_FAILURE, SIGN_UP_REQUEST, LOG_IN_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from '../reducers/user';

axios.defaults.baseURL = 'http://localhost:7070/api';

function loginAPI(loginData){
    // 서버에 요청을 보내는 부분
    return axios.post('/user/login', loginData);
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

export default function* userSaga(){
    yield all ([
        fork(watchLogin),
        fork(watchSignUp),
    ]);
}