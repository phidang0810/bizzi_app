import { Form, Input, Button, Select, Col, Row } from "antd";
import React, { MouseEventHandler } from "react";
import { POST_STATUS } from "../../constant";
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
};

interface Props {
    data: any;
    errors: object | null;
    loading: boolean;
    onCancel: MouseEventHandler;
    onSubmit: MouseEventHandler;
}

export const PostForm: React.FC<Props> = ({ data, onSubmit, loading, onCancel }) => {
    const [form] = Form.useForm();

    return (
        <Form {...formItemLayout} 
        onFinish={onSubmit} 
        form={form} id="mForm" 
        scrollToFirstError initialValues={data}
        >            
            <Row gutter={[16,16]}>
                <Col xs={24} sm={24}>
                    <FormItem label="Title" name="title" rules={[{ required: true }]}>
                        <Input type="text" placeholder="Input title..." width={300} />
                    </FormItem>

                    <FormItem label="Content" name="text">
                        <Input.TextArea rows={6} />
                    </FormItem>

                    <FormItem label="Status" name="status" rules={[{ required: true, message: "Please chooose a status!" }]}>
                        <Select style={{ width: "150px" }}>
                            <Select.Option value={POST_STATUS.ACTIVE}>Active</Select.Option>
                            <Select.Option value={POST_STATUS.INACTIVE}>Inactive</Select.Option>
                        </Select>
                    </FormItem>
                    
                    <Form.Item wrapperCol={{ sm: { span: 20, offset: 8 }, xs: { span: 24, offset: 0 } }}>
                        <div>
                            <Button type="primary" htmlType="submit">
                                <i className="far fa-check" /> <span className="d-sm-inline-block">Save</span>
                            </Button>

                            <Button onClick={onCancel} loading={loading} style={{ marginLeft: 5 }}>
                                <span className="d-sm-inline-block"> Cancel</span>
                            </Button>
                        </div>
                    </Form.Item>
                </Col>
                {/* <Col xs={24} sm={12}>
                    <FormItem label="Content" name="text" rules={[{ required: true }]}>
                        <Editor value={`${data?.text}`} onChange={(value: string) => {form.setFieldsValue({'text': value})}}/>  
                    </FormItem>
                </Col> */}
            </Row>
        </Form>
    );
};
