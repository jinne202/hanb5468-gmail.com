import React from 'react';
import { Form, Input, Button } from 'antd';

const NicknameEditForm = () => {
    return (
        <Form style={{ marginBottom : '20px', border : '1px solid #d9d9d9', padding : '20px' }}>
            <Input addonBefore = "Nickname"/>
            <Button type="primary">Modify</Button>
        </Form>
    );
};

export default NicknameEditForm;