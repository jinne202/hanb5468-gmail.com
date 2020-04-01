import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NicknameEditForm = () => {
    const dispatch = useDispatch();
    const { me } = useSelector(state => state.user);
    const [editedName, setEditedName] = useState('');
    const onChangeNickname = useCallback((e) => {
        setEditedName(e.target.value);
    }, []);
    const onEditNickname = useCallback((e) => {
        e.preventDefault();
        dispatch({
            type : EDIT_NICKNAME_REQUEST,
            data : editedName,
        });
    }, []);

    return (
        <Form style={{ marginBottom : '20px', border : '1px solid #d9d9d9', padding : '20px' }} onSubmit={onEditNickname}>
            <Input addonBefore = "Nickname" style={{width : '80%', marginRight : '10px'}} value = {editedName || (me && me.nickname)} onChange={onChangeNickname} />
            <Button type="primary" style={{width : '17%'}}>Modify</Button>
        </Form>
    );
};

export default NicknameEditForm;