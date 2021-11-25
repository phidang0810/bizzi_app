import React, { useEffect, useState } from "react";

import { Breadcrumb, Card, Col, Empty, Image, Pagination, Row } from 'antd';
import HomeLayout from "../layouts/HomeLayout";
import { Link } from "react-router-dom";
import { usePostsQuery } from "../generated/graphql";
import {
    HomeOutlined
  } from '@ant-design/icons';

const { Meta } = Card;

interface Props {}
const itemsPerPage = 4;
export const PostListPage: React.FC<Props> = () => {

    const [page, setPage] = useState(1);

    const { data, loading, fetchMore } = usePostsQuery({
        variables: {
            searchPostsInput: {
                page: page,
                length: itemsPerPage,
                orderField: 'createdAt',
                orderType: 'DESC'
            }
        }
    });

    useEffect(() => {
        fetchMore({ 
            variables: { 
                searchPostsInput: {
                    page: page,
                    length: itemsPerPage,
                    orderField: 'createdAt',
                    orderType: 'DESC' 
                }
            } 
        })
    }, [page])

    if(loading) {
       return <div>Loading...</div>
    }

    return (
        <HomeLayout>            
            <div>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item><Link to='/'><HomeOutlined /> Home</Link></Breadcrumb.Item>
            </Breadcrumb>
                {data?.posts?.rows.length === 0 ? <Empty /> :
                        <>
                            <Row gutter={[16,16]}>
                            {                    
                                data?.posts?.rows.map((item) => 
                                    <Col xs={24} sm={12} md={8} lg={4} key={item.id}>
                                        <Card
                                            hoverable
                                            className='w-100'                                
                                            cover={<Link to={`/${item.slug}/${item.id}`}>
                                                <Image alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                                                </Link>}
                                        >
                                            <Meta title={item.title} description={item.shortDes} />
                                            <Link to={`/${item.slug}/${item.id}`}>Xem chi tiết</Link>
                                        </Card>
                                    </Col>
                                )
                            }
                            </Row>
                            <div className='text-center' style={{marginTop: '20px'}}>
                                <Pagination 
                                current={data?.posts?.page} 
                                total={data?.posts?.total || 0} 
                                onChange={(page) => setPage(page)} 
                                pageSize={itemsPerPage}/>
                            </div>
                        </>
                }
                
            </div>
        </HomeLayout>
    );
};
