import React, { useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import LoginForm from './LoginForm';
import { Menu, Input, Row, Col, Card, Avatar, Button, Form } from 'antd';
import UserProfile from './UserProfile';
import { useSelector, useDispatch } from 'react-redux';
// import { LOAD_USER_REQUEST } from '../reducers/user';

const AppLayout = (props) => {
    // const { me } = useSelector(state => state.user);
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     if (!me) {
    //         dispatch({
    //             // 쿠키로 정보 불러오게
    //             type : LOAD_USER_REQUEST,
    //         });
    //     }
    // }, []);

    const {
        children
    } = props;
    
    const {isLoggedIn} = useSelector(state => state.user);
    return (
        <div>
            <Menu mode="horizontal">
                <Menu.Item key="home"><Link href="/"><a>nodebird</a></Link></Menu.Item>
                <Menu.Item key="profile"><Link href="/profile"><a>profile</a></Link></Menu.Item>
                <Menu.Item key="mail">
                    <Input.Search enterButton style={{verticalAlign : 'middle'}}/>
                </Menu.Item>
            </Menu>
            <Row gutter = {20}>
                <Col xs={24} md={6}>
                    {/* {me ?
                    <UserProfile/>
                    :
                    <LoginForm/>
                    } */}
                    {/* 이 파트는 2강 따라하면서 넣은 부분 */}
                    {isLoggedIn ?
                    <UserProfile/>
                    :
                    <LoginForm/>
                    }
                    {/* 따라하면서 넣은 부분! */}
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>
                </Col>
            </Row>
        </div>
    )
}

AppLayout.propTypes = {
    children : PropTypes.node,
}

export default AppLayout;