import { Layout} from "antd";
import NavBar from "../components/NavBar";

const { Content } = Layout;

const HomeLayout = (props : any) => {
    return (
        <Layout className='home-layout'>
            <NavBar />
            <Content className="site-layout" style={{ padding: "0 50px", marginTop: 64 }}>                
                <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                    {props.children}
                </div>
            </Content>            
        </Layout>
    );
}

export default HomeLayout;
