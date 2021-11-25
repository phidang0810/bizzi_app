import React, { useState } from "react";

import { Avatar, Breadcrumb, Button, Input, message } from 'antd';
import { Link, useParams, Redirect, useHistory } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import { useCreateCommentMutation, useMeQuery, usePostQuery } from "../generated/graphql";
import { Loading } from "../components/Loading";
import {
    HomeOutlined
  } from '@ant-design/icons';
import { formatTimeFromNow } from "../helper";

interface Props {}

export const PostDetailPage: React.FC<Props> = () => {
    let { id } : {id: string} = useParams();
    const {location} = useHistory();    
    const [textComment, setTextComment] = useState('')
    const {data, loading, fetchMore, error} = usePostQuery({
        variables: {
            id
        }
    });
        
    const {data: meData, loading: loadingMe} = useMeQuery();
    const [postComment] = useCreateCommentMutation();

    async function handlePostComment()
    {
        try {
            await postComment({
                variables: {
                    postId: parseInt(id),
                    text: textComment
                }
            })
            fetchMore({variables:{id}});
            setTextComment('');
            message.success('Success!')
        } catch(error) {
            console.log(error)
            message.success('Error!')
        }
        
    }

    if(error) return <Redirect to='/not-found' />

    return (
        <HomeLayout>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item><Link to='/'><HomeOutlined /> Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item>{data?.post?.title}</Breadcrumb.Item>
            </Breadcrumb>
            <div>
                {loading ? <Loading /> : 
                    <div>                        
                        <div dangerouslySetInnerHTML={{__html: `${data?.post?.text}`}} />
                    </div>
                }
                
            </div>
            <div>
                <h2>Comments</h2>
                <div>
                    <Input.TextArea value={textComment} showCount maxLength={150} rows={5} style={{width: '500px'}} onChange={(e) => setTextComment(e.target.value)} />
                    <div style={{marginTop: '10px'}}>

                        {!loadingMe && !meData?.me?.id ? <Link to={`/login?redirect=${location.pathname}`}>
                            <Button type='primary'>Login to comment</Button>
                        </Link> :
                            <Button type='primary' onClick={handlePostComment}>Comment</Button>
                        }
                        
                    </div>
                </div>
                <div className='comment-list'>
                    {
                        data?.post?.comments.map(comment => (
                            <div className='comment-item' key={`cm-${comment.id}`}>
                                <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', margin:'5px 10px 0 0' }}>{comment.user.name.substring(0,1)}</Avatar>
                                <div>
                                    <div className='author'>{comment.user.name}</div>
                                    <div className='time'>{formatTimeFromNow(comment.createdAt)}</div>
                                    <p>
                                        {comment.text}  
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </HomeLayout>
    );
};
