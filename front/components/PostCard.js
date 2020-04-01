import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import { ADD_COMMENT_REQUEST, LOAD_COMMENT_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST } from '../reducers/post';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent'

const PostCard = ({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector(state => state.user);
    const { commentAdded, isAddingComment } = useSelector(state => state.post);
    const dispatch = useDispatch();

    const liked = me && post.Likers && post.Likers.find(v => v.id === me.id);

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

    const onToggleLike = useCallback(()=> {
        if (!me) {
            return alert('로그인이 필요합니다');
        }
        // likers 안에 좋아요 누른 사람들의 배열이 들어있음
        if (liked) { //좋아요 누른 상태
            dispatch({
                type : UNLIKE_POST_REQUEST,
                data : post.id
            })
        } else { //좋아요 안 누른 상태
            dispatch({
                type : LIKE_POST_REQUEST,
                data : post.id
            })
        }
    }, [me && me.id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if(!me){
            return alert('로그인이 필요합니다');
        }
        return dispatch({
            type : RETWEET_REQUEST,
            data : post.id,
        });
    }, [me && me.id , post && post.id]);

    const onFollow = useCallback(userId => () => {
        dispatch({
            type : FOLLOW_USER_REQUEST,
            data : userId,
        });
    }, []);

    const onUnfollow = useCallback(userId => () => {
        dispatch({
            type : UNFOLLOW_USER_REQUEST,
            data : userId,
        });
    }, []);

    return (
        <div>
            <Card
                style = {{margin : '40px 0 0'}}
                key = {+post.createdAT}
                // cover = {post.Images[0] && <img alt="example" src={`http://localhost:7070/` + post.Images[0].src}/>}
                cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
                actions = {[
                    <Icon type="retweet" key="retweet" onClick={onRetweet}/>,
                    <Icon type="heart" key="heart" theme={liked ? 'twoTone' : 'outlined'} twoToneColor="#eb2f96" onClick={onToggleLike}/>,
                    <Icon type="message" key="message" onClick={onToggleComment}/>,
                    <Icon type="ellipsis" key="ellipsis"/>
                ]}
                title = {post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다` : null}
                //로그인을 안 했다면 버튼이 보이지 않음
                extra = {!me || post.User.id === me.id
                    ?
                    null
                    : me.Followings && me.Followings.find(v => v.id === post.User.id) //내가 이미 팔로우 한 사용자
                        ? <Button onClick={ onUnfollow(post.User.id) }>UnFollow</Button>
                        : <Button onClick={ onFollow(post.User.id) }>Follow</Button>
                }
            >
            {post.RetweetId && post.Retweet
            ? (
            <Card cover = {post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
                <Card.Meta
                    avatar = {<Link href = {{ pathname : '/user', query : { id : post.Retweet.User.id } }} as = {`/user/${post.Retweet.User.id}`}><a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a></Link>}
                    title = {post.Retweet.User.nickname}
                    description = {<PostCardContent postData={post.Retweet.content}/>}
                />
            </Card>
            ) : (
            <Card.Meta
                avatar = {<Link href = {{ pathname : '/user', query : { id : post.User.id } }} as = {`/user/${post.User.id}`}><a><Avatar>{post.User.nickname[0]}</Avatar></a></Link>}
                title = {post.User.nickname}
                description = {<PostCardContent postData={post.content}/>}
            />
            )}
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