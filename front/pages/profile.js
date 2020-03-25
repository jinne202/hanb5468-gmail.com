import React from 'react';
import { Button, List, Card, Icon } from 'antd';
import NicknameEditForm from '../components/NicknameEditForm';

const Profile = () => {
    return(
        <>
            <div style = {{margin : '40px 0 0'}}>
                <NicknameEditForm/>
                <List
                    style = {{marginBottom : '20px'}}
                    grid = {{gutter : 4, xs : 2, md : 3}}
                    size = "small"
                    header = {<div> Follower List</div>}
                    loadMore = {<Button style={{width : '100%'}}>More</Button>}
                    bordered
                    dataSource = {['JINNE', '25', 'FRONTEND']}
                    renderItem = {item => (
                        <List.Item style = {{marginTop : '20px'}}>
                            <Card actions = {[<Icon key="stop" type="stop" />]}>
                                <Card.Meta description={item}/>
                            </Card>
                        </List.Item>
                    )}
                />
                <List
                    style = {{marginBottom : '20px'}}
                    grid = {{gutter : 4, xs : 2, md : 3}}
                    size = "small"
                    header = {<div> Following List</div>}
                    loadMore = {<Button style={{width : '100%'}}>More</Button>}
                    bordered
                    dataSource = {['JINNE', '25', 'FRONTEND']}
                    renderItem = {item => (
                        <List.Item style = {{marginTop : '20px'}}>
                            <Card actions = {[<Icon key="stop" type="stop" />]}>
                                <Card.Meta description={item}/>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
};

export default Profile;