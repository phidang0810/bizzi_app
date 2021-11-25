import { Breadcrumb, message } from "antd";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    HomeOutlined
  } from '@ant-design/icons';
  
import HomeLayout from "../../layouts/HomeLayout";
import { PostForm } from "./_form";
import { useCreatePostMutation } from "../../generated/graphql";

interface Props {}

export const ManageAddPostPage: React.FC<Props> = () => {    
    const history = useHistory()
    const [loading, setLoading] = useState(false);
    const [createPost] = useCreatePostMutation();
    
    function handleCancel() {
        history.push('/manage-post');
    }

    async function handleAdd(params: any) {        
        setLoading(true);
        try {
            await createPost({
                variables: {
                    createPostInput: params                    
                }
            });
            setLoading(false);
            message.success('Create successful!')
            history.push('/manage-post');

        } catch (error: any) {
            console.log(error);
            setLoading(false);
            message.error('Invalid paramter')
        }
    }

    return (
        <HomeLayout>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item><Link to='/'><HomeOutlined /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/manage-post'>Manage Posts</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Add New Post</Breadcrumb.Item>
            </Breadcrumb>
            
            <PostForm 
                data={{status: 1}} 
                loading={loading}
                onCancel={handleCancel}
                onSubmit={handleAdd}
                errors={{}}
            />
            
        </HomeLayout>
    );
};
