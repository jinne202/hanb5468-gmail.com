import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_COMMENT_REQUEST, LOAD_COMMENT_REQUEST } from '../reducers/post';
import PostImages from './PostImages';

const PostCard = ({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector(state => state.user);
    const { commentAdded, isAddingComment } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const onToggleComment = useCallback(() => {
        // 펼쳐져있으면 닫고 닫혀있으면 펼치고
        setCommentFormOpened(prev => !prev);
        if (!commentFormOpened) {
            dispatch({
                type : LOAD_COMMENT_REQUEST,
                data : post.id,
            });
        }
    }, []);

    const onSubmitComment = useCallback((e) => {
        e.preventDefault();
        if (!me) {
            return alert('로그인이 필요합니다');
        }
        return dispatch({
            type : ADD_COMMENT_REQUEST,
            data : {
                postId : post.id,
                content : commentText,
            },
        });
    }, [me && me.id, commentText]);

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true]);

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    }, []);

    return (
        <div>
            <Card
                style = {{margin : '40px 0 0'}}
                key = {+post.createdAT}
                // cover = {post.Images[0] && <img alt="example" src={`http://localhost:7070/` + post.Images[0].src}/>}
                cover = {post.Images[0] && <PostImages images={post.Images} />}
                actions = {[
                    <Icon type="retweet" key="retweet"/>,
                    <Icon type="heart" key="heart"/>,
                    <Icon type="message" key="message" onClick={onToggleComment}/>,
                    <Icon type="ellipsis" key="ellipsis"/>
                ]}
                extra = {<Button>follow</Button>}
            >
            <Card.Meta
                avatar = {<Link href = {{ pathname : '/user', query : { id : post.User.id } }} as = {`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                title = {post.User.nickname}
                description = {<div>
                    {post.content.split(/(#[^\s]+)/g).map((v) => {
                        if (v.match(/#[^\s]+/)){
                            return (
                                <Link
                                    href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                                    as={`/hashtag/${v.slice(1)}`}
                                    key={v}
                                >
                                <a>{v}</a>
                                </Link>
                            );
                        }
                    return v;
                })}</div>}
            />
            </Card>
            {commentFormOpened && (
                <>
                    <Form onSubmit={onSubmitComment}>
                        <Form.Item>
                            <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading = {isAddingComment}>삐약</Button>
                    </Form>
                    <List
                        header={`${post.Comments ? post.Comments.length : 0} reply`}
                        itemLayout = "horizontal"
                        dataSource = {post.Comments || []}
                        renderItem = {item => (
                            <li>
                                <Comment
                                    author = {item.User.nickname}
                                    avatar = {<Link href = {{ pathname : '/user', query : { id : item.User.id } }} as = {`/user/${item.User.id}`}><a><Avatar>{item.User.nickname[0]}</Avatar></a></Link>}
                                    content = {item.content}
                                />
                            </li>
                        )}
                    />
                </>
            )}
        </div>
    );
}

PostCard.propTypes = {
    post : PropTypes.shape({
        User : PropTypes.object,
        content : PropTypes.string,
        img : PropTypes.string,
        createdAT : PropTypes.string,
    }),
};

export default PostCard;