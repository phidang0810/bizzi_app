import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useHistory } from "react-router-dom";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import Search from "./Search";
import { setAccessToken } from "../accessToken";

const NavBar = () => {
    const {data, loading} = useMeQuery();
    const [logout, { client }] = useLogoutMutation();
    const history = useHistory()
    let body;
    if(loading) body = null;

    else if (!data?.me) {
        body = <Link to='/login'>
                    <Button size='middle'>Login</Button>
                </Link>
    } else {
        const menu = (
            <Menu>
              <Menu.Item key="0">
                <Link to='/manage-post'>Manage post</Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="3" onClick={logOut}>Logout</Menu.Item>
            </Menu>
          );

        body =  <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /> 
                        <span style={{margin: '0 5px'}}>{data.me.name}</span>
                        <DownOutlined />
                    </a>
                </Dropdown>
    }
    
    async function logOut() {
        try {
            await logout()
            setAccessToken("");
            await client!.resetStore();
            history.push('/login');
            
        } catch (error) {
            console.log(error)
            history.push('/login');
        }
    }

    return (<>
        <Layout.Header className='header'>
                    <div className='text-left' style={{display:'flex', alignItems: 'center'}}> 
                        <Link to='/'>                       
                                <div className='logo'>Test App</div>
                        </Link>
                        <Search/>
                    </div>
                    <div className='text-right'>
                        {body}
                    </div>
            </Layout.Header>
    </>);
}

export default NavBar;
