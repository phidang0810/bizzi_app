import { Alert, Breadcrumb, Button, message } from "antd";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
    HomeOutlined
  } from '@ant-design/icons';
  import { useParams } from "react-router-dom";
import HomeLayout from "../../layouts/HomeLayout";
import { PostForm } from "./_form";
import { useMeQuery, usePostQuery, useUpdatePostMutation } from "../../generated/graphql";
import { Loading } from "../../components/Loading";

interface Props {}

export const ManagePostDetailPage: React.FC<Props> = () => {
    let { id } : {id: string} = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [updatePost] = useUpdatePostMutation();
    const {data, loading: initLoading} = usePostQuery({
		variables: { id }
	});

    const {data: meData, loading: loadingMe} = useMeQuery();
    
    function handleCancel() {
        history.push('/manage-post');
    }

    async function handleUpdate(params: any) {
        params.id = id;
        setLoading(true);
        try {
            await updatePost({
                variables: {
                    updatePostInput: params
                }
            });
            setLoading(false);
            message.success('Update successful!')
            history.push('/manage-post');
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    
    let body = <div></div>;
    if(!loadingMe && !initLoading && meData?.me?.id !== data?.post?.userId.toString()) {
        body = <div>
                    <Alert
                        message="Access Denied"
                        description="You can't not access this post"
                        type="error"
                        showIcon
                        style={{marginBottom: '10px'}}
                        />
                        <div className='text-right'>
                            <Link to='/manage-post'>
                                <Button>Back to list</Button>
                            </Link>
                        </div>                    
                </div>
    } else {
        body = initLoading ? <Loading /> : 
            <PostForm 
                data={data?.post} 
                loading={loading}
                onCancel={handleCancel}
                onSubmit={handleUpdate}
                errors={{}}
            />
    }

    return (
        <HomeLayout>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item><Link to='/'><HomeOutlined /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link to='/manage-post'>Manage Posts</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Edit Post</Breadcrumb.Item>
            </Breadcrumb>
                {body}
        </HomeLayout>
    );
};
