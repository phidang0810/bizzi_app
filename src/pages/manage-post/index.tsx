import React, { useState } from "react";

import { Breadcrumb, Button, Col, Modal, Row, Table } from "antd";
import HomeLayout from "../../layouts/HomeLayout";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import { useDeletePostMutation, useMyPostsQuery } from "../../generated/graphql";
import { Loading } from "../../components/Loading";
import { POST_STATUS } from "../../constant";

interface Props {}

export const ManagePostListPage: React.FC<Props> = () => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const { data, loading, fetchMore } = useMyPostsQuery({
        variables: {
            searchPostsInput: {
                page: page,
                length: itemsPerPage,
                orderField: "createdAt",
                orderType: "DESC"
            }
        },
        fetchPolicy: "network-only"
    });

    const [deletePost] = useDeletePostMutation();

    if (loading) return <Loading />;

    const columns = [
        {
            title: "Title",
            dataIndex: "title"
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (status: number) => {                
                return status == POST_STATUS.ACTIVE ? (
                    <span className="badge bg-success">Active</span>
                ) : (
                    <span className="badge bg-default">Inactive</span>
                );
            }
        },
        {
            title: "Created at",
            dataIndex: "createdAt",
            width: "20%"
        },
        {
            title: "",
            width: 120,
            render: (record: any) => {
                return (
                    <>
                        {
                            <Link to={`/manage-post/${record.id}`} className="ant-btn ant-btn-primary ant-btn-sm" style={{ marginLeft: 5 }}>
                                <i className="far fa-edit" />
                                <EditOutlined />
                            </Link>
                        }
                        {
                            <Button onClick={() => handleDelete(record)} size="small" type="primary" danger style={{ marginLeft: 5 }}>
                                <DeleteOutlined />
                            </Button>
                        }
                    </>
                );
            }
        }
    ];

    const handleDelete = (row: any) => {
        Modal.confirm({
            title: "Confirmation",
            content: (
                <div>
                    Are you sure you want to delete <b>{row.title}</b>?
                </div>
            ),
            onOk: async () => {
                try {
                    const response = await deletePost({
                        variables: {
                            id: row.id
                        }
                    });
                    fetchMore({
                        variables: {
                            page: page,
                            length: itemsPerPage,
                            orderField: "createdAt",
                            orderType: "DESC"
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };

    function handleTableChange(pagination: any, filters: any, sorter: any) {
        const { current, pageSize } = pagination;
        setPage(current);
        setItemsPerPage(pageSize);
        console.log(sorter);
    }

    return (
        <HomeLayout>
            <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined /> Home
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Manage Posts</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={[16, 16]} style={{ marginBottom: "10px" }} justify="space-between">
                <Col xs={12}>
                    <div>
                        Showing {data?.myPosts?.rows.length} / {data?.myPosts?.total} items
                    </div>
                </Col>
                <Col xs={12} className="text-right">
                    <Link to="/manage-post/add">
                        <Button type="primary" size="middle">
                            Add new post
                        </Button>
                    </Link>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={data?.myPosts?.rows}
                pagination={{
                    //showSizeChanger: true,
                    current: page,
                    pageSize: itemsPerPage,
                    total: data?.myPosts?.total
                }}
                loading={loading}
                onChange={handleTableChange}
            />
        </HomeLayout>
    );
};
