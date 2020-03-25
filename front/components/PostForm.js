import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST } from '../reducers/post';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);

  useEffect(() => {
    setText('');
  }, [postAdded === true]);

  const onSumbitForm = useCallback((e) => {
    e.preventDefault();
    if(!text || !text.trim()){
      return alert('게시글을 작성하세요');
    }
    dispatch({
      type : ADD_POST_REQUEST,
      data : {
        content : text,
      }
    })
  }, [text]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);
    return (
        <Form style={{margin : '40px 0 20px'}} encType = "multipart/form-data" onSubmit = {onSumbitForm}>
            <Input.TextArea maxLength = {140} placeholder = "HOW ARE YOU TODAY?" value = {text} onChange = {onChangeText}/>
            <div>
              <Input type = "file" multiple hidden />
              <Button>Image Upload</Button>
              <Button type = "primary" style = {{ float : "right" }} htmlType = "submit" loading = {isAddingPost}>TWIT!</Button>
            </div>
            <div>
              {imagePaths.map((v, i) => {
                return (
                  <div key = {v} style = {{display : 'inline-block'}}>
                    <img src={`http://localhost : 3000/${v}`} stype={{width : '200px'}} alt = {v}/>
                    <div>
                      <Button>REMOVE</Button>
                    </div>
                  </div>
                )
              })}
            </div>
        </Form>
    )
};

export default PostForm;