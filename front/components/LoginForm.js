import React, {useState, useCallback} from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useInput} from '../pages/signup';
import { LOG_IN_REQUEST } from '../reducers/user';

const LoginForm = () => {
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    const { isLoggingIn } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        dispatch({
            type : LOG_IN_REQUEST,
            data : {
                userId : id,
                password,
            }
        });
    }, [id, password]);

    return (
        <Form style={{margin : '40px 20px 20px'}} onSubmit = {onSubmitForm}>
            <div>
                <label htmlFor = "user-id">ID</label>
                <br/>
                <Input name = "user-id" value = {id} onChange = {onChangeId} required/>
            </div>
            <div>
                <label htmlFor = "user-password">PASSWORD</label>
                <br/>
                <Input name = "user-password" value = {password} onChange={onChangePassword} type="password" required/>
            </div>
            <div>
            <Button type = "primary" htmlType = "submit" loading={isLoggingIn}>LOGIN</Button>
            <Link href="/signup"><Button>SIGN UP</Button></Link>
            </div>
        </Form>
    )
}

export default LoginForm;