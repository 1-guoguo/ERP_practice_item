// 该文件是整个主页面
import React from 'react'
import { Layout, Space, theme } from 'antd';
import { useRoutes } from 'react-router-dom';
import Head from '../../component/Head';
import Nav from '../../component/Nav'
import TabHeader from '../../component/TabHeader'
import routes from '../../routes/routes';
import Login from '../../component/Login/Login';

const { Content } = Layout

export default function Main() {
  const {
    token: { colorBgContainer },
    } = theme.useToken();
    const element = useRoutes(routes)  
    return(
      sessionStorage.getItem('loginStatus') ? 
      <Space
        direction="vertical"
        style={{
        width: '100%',
        height: '100%',
      }}
      // size={[0, 48]}
      >
        <Head />
        <Layout >
          <Nav />
          <Layout style={{height: '100%', background: "white"}}>
            <TabHeader/>
            <Content style={{padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,}}>
            {element}
            </Content>
            
          </Layout>
        </Layout>
      </Space>
      :
      <Login />
    ) 
}
