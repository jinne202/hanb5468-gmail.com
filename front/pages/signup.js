import React, { useState, useEffect, useCallback, memo } from 'react';
// import Head from 'next/head';
// import AppLayout from '../components/AppLayout';
import { Form, Input, Checkbox, Button } from 'antd'
import PropTypes from 'prop-types';
import { SIGN_UP_REQUEST } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';

const TextInput = ({ value }) => (
    <div>{value}</div>
);

TextInput.propTypes = {
    value: PropTypes.string,
};

// custom hook -!
export const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
};
// 커스텀 훅을 만들 수 있음. 중복되는 것들!

const SingUp = () => {
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [termError, setTermError] = useState('');
    // 커스텀 훅 적용
    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');
    // 커스텀 훅 적용

    const { isSigningUp, me } = useSelector(state => state.user)

    useEffect(() => {
        if (me) {
            // 로그인 했으니 메인페이지로 이동
            Router.push('/');
        }
    }, [me && me.id]);

    const dispatch = useDispatch();
    // FORM은 REACT의 USESTATE를 쓰고 REDUX에서는 최종본을 모아서 넣음! 이렇게 하면 STATE를 둘 다 쓰는 셈이 된다.

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if(password !== passwordCheck){
            return setPasswordError(true);
        }
        setTermError(!term);
        dispatch({
            type : SIGN_UP_REQUEST,
            data : {
                userId : id,
                nickname : nick,
                password
            }
        });
    }, [id, nick, password, passwordCheck, term]);

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordError(e.target.value !== password);
        setPasswordCheck(e.target.value);
    }, [password]);

    const onChangeTerm = useCallback((e) => {
        setTerm(e.target.checked);
    }, []);

    useEffect(() => {
        term && setTermError(false);
    }, [term]);

    return(
        <>
            <Form onSubmit = {onSubmit} style={{padding : 10}}>
                <div>
                    <label htmlFor="user-id">USER ID</label>
                    <br/>
                    <Input name="user-id" value={id} required onChange={onChangeId}/>
                </div>
                <div>
                    <label htmlFor="user-nick">USER Nickname</label>
                    <br/>
                    <Input name="user-nick" value={nick} required onChange={onChangeNick}/>
                </div>
                <div>
                    <label htmlFor="user-password">USER Password</label>
                    <br/>
                    <Input name="user-password" type="password" value={password} required onChange = {onChangePassword}/>
                </div>
                <div>
                    <label htmlFor="user-password-check">USER Password check</label>
                    <br/>
                    <Input name="user-password-check" type="password"  value={passwordCheck} required onChange = {onChangePasswordCheck}/>
                    {passwordError && <div style={{color : 'red'}}> 비밀번호가 일치하지 않습니다 </div>}
                </div>
                <div style={{marginTop : 10}}>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>ok?</Checkbox>
                    {termError && <div style={{color : 'red'}}>약관에 동의하셔야 합니다</div>}
                </div>
                <div style={{marginTop : 10}}>
                    <Button type="primary" htmlType="submit" loading = {isSigningUp}
                    >SIGN UP</Button>
                </div>
            </Form>
        </>
    );
};

export default SingUp;