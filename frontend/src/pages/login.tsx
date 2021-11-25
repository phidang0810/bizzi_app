import React from "react";

import { message, Form, Input, Button, Divider } from "antd";
import { useHistory, Redirect } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import { MeDocument, MeQuery, useAuthCallbackMutation, useLoginMutation, useMeQuery } from "../generated/graphql";
import { setAccessToken } from "../accessToken";
import { Loading } from "../components/Loading";
import { LockOutlined } from "@ant-design/icons";

interface Props {}
const keyDirect = "?redirect=";

export const LoginPage: React.FC<Props> = () => {
    const { location } = useHistory();
    let urlRedirect = "";
    if (location.search.indexOf(keyDirect) !== -1) {
        urlRedirect = location.search.substring(keyDirect.length);
    }

    const [authCallback] = useAuthCallbackMutation();
    const [login] = useLoginMutation();
    const history = useHistory();
    const { data, loading } = useMeQuery();

    if (loading) return <Loading />;
    if (!loading && data) return <Redirect to="/manage-post" />;

    async function responseFacebook(res: any) {
        console.log("res=", res);
        try {
            const response = await authCallback({
                variables: {
                    social: "facebook",
                    token: res.accessToken,
                    userId: res.id
                },
                update: (store, { data }) => {
                    if (!data) {
                        return null;
                    }

                    store.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            me: data.loginSocialCallback.user
                        }
                    });
                }
            });
            if (response && response.data) {
                setAccessToken(response.data.loginSocialCallback.accessToken as string);
                return history.push(urlRedirect !== "" ? urlRedirect : "/manage-post");
            }
        } catch (error: any) {
            console.log(error);
            message.error("Not authenticated.");
        }
    }

    function onFinish(values: any) {
        try {
            const response = await login({
                variables: {
                    email: values.email,
                    password: values.password
                },
                update: (store, { data }) => {
                    if (!data) {
                        return null;
                    }

                    store.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            me: data.login.user
                        }
                    });

                }
            });
            if (response && response.data) {
                setAccessToken(response.data.login.accessToken as string);
                return history.push(urlRedirect !== "" ? urlRedirect : "/manage-post");
            }
        } catch {
            message.error("Email or password is incorrect.");
        }
    }
    return (
        <div className="login-page d-flex flex-row justify-content-center align-items-center">
            <div className="wrap-content">
                <h2>Sign In</h2>
                <div>
                    <Form layout="vertical" onFinish={onFinish} style={{ padding: "0 20px" }}>
                        <Form.Item label="Email" name="email" rules={[{ type: "email", required: true }]} initialValue={process.env.REACT_APP_EMAIL}>
                            <Input style={{ color: "#777777" }} className="w-100" />
                        </Form.Item>

                        <Form.Item label="Password" name="password" style={{ marginBottom: "5px" }} rules={[{ required: true }]} initialValue={process.env.REACT_APP_PASSWORD}>
                            <Input.Password prefix={<LockOutlined />} style={{ color: "#777777" }} className="w-100" />
                        </Form.Item>

                        <div style={{marginBottom: '10px', marginTop: '20px'}}>
                            <Button className="w-100" type="primary" loading={loading} htmlType="submit">
                                Login
                            </Button>
                        </div>
                        <Divider plain>OR</Divider>
                        <FacebookLogin
                        appId={`${process.env.REACT_APP_FB_ID}`}
                        autoLoad={false}
                        cssClass="ant-btn ant-btn-default w-100"
                        callback={responseFacebook}
                    />
                    </Form>
                    
                </div>
            </div>
        </div>
    );
};
