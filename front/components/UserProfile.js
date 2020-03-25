import React, { useCallback } from 'react';
import { Card, Avatar, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
    const { me } = useSelector(state => state.user)
    const dispatch = useDispatch();
    const onLogout = useCallback(() => {
        dispatch({
            type : LOG_OUT_REQUEST,
        });
    }, []);
    let postLength = me && me.Posts ? me.Posts.length : 0;
    let followingLength = me && me.Followings ? me.Followings.length : 0;
    let followerLength = me && me.Followers ? me.Followers.length : 0;
    return (
        <Card actions = {[
            <div key="twit">짹짹<br/>{postLength}</div>,
            <div key="following">팔로윙<br/>{followingLength}</div>,
            <div key="follower">팔로워<br/>{followerLength}</div>
        ]}>
        <Card.Meta
            avatar = {<Avatar>{me.nickname[0]}</Avatar>}
            title = {me.nickname}
        />
        <Button onClick = {onLogout}>LOGOUT</Button>
        </Card>
    )
}

export default UserProfile;