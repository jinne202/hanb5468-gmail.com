import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGE_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const { imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);
  const imageInput = useRef();

  useEffect(() => {
    if (postAdded) {
      setText('');
    }
  }, [postAdded === true]);

  const onSubmitForm = useCallback((e) => {
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
  
  // ajax 사용해서 form data 전송
  const onChangeImage = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type : UPLOAD_IMAGE_REQUEST,
      data : imageFormData,
    })
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(index => () => {
    dispatch({
      type : REMOVE_IMAGE,
      index,
    })
  }, []);

  return (
      <Form style={{margin : '40px 0 20px'}} encType = "multipart/form-data" onSubmit = {onSubmitForm}>
          <Input.TextArea maxLength = {140} placeholder = "HOW ARE YOU TODAY?" value = {text} onChange = {onChangeText}/>
          <div>
          <input type="file" multiple hidden ref={imageInput} onChange={onChangeImage} />
          <Button onClick={onClickImageUpload}>이미지 업로드</Button>
            <Button type = "primary" style = {{ float : "right" }} htmlType = "submit" loading = {isAddingPost}>TWIT!</Button>
          </div>
          <div>
            {imagePaths.map((v, i) => {
              return (
                <div key = {v} style = {{display : 'inline-block'}}>
                  <img src={`http://localhost:7070/${v}`} stype={{width : '200px'}} alt = {v}/>
                  <div>
                    <Button onClick = {onRemoveImage(i)}>REMOVE</Button>
                  </div>
                </div>
              )
            })}
          </div>
      </Form>
  )
};

export default PostForm;