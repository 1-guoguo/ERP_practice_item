import React, { useState } from 'react'
import { 
  MailOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined, MoneyCollectOutlined
 } from '@ant-design/icons';
// import { MailOutlined } from '@ant-design/icons';
import { useNavigate, NavLink } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import PubSub from 'pubsub-js';
import navRouts from '../../routes/navRouts';
import './index.css'
const { Sider } = Layout;
const {SubMenu, Item} = Menu
  
  export default function Nav() {
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate()

    const {
      token: { colorBgContainer },
      } = theme.useToken();
    
      const onClick = (e) => {
        console.log('click', e);
        // const { outerText:data } = e.domEvent.target
        navigate(e.key, { replace: true })
      };
    return (
      <div>
        <Sider className='siderStyle' style={{background: colorBgContainer}} 
        width={200} 
        collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value) }>
        {/* <Sider> */}
          <div className='title' >
            <span >进销存系统</span>
          </div>
          <div className="demo-logo-vertical" />
            <Menu 
                  // defaultOpenKeys={['sub1']}
                  onClick={onClick} 
                  style={{height: '100%', borderRight: 0,}} 
                  mode="vertical" >
              {navRouts.map((sub, index)=> {
                if (!sub.children){
                  return(
                    <Menu.Item index={index} key={sub.key} icon={sub.icon} onClick={()=>{
                      const home={label: sub.label, path: sub.path}; 
                      // console.log("data----->", data);
                      // 通过消息订阅与发布传参, 同时修改兄弟组件的状态
                      PubSub.publish('homeData', home)
                    }}>{sub.label}</Menu.Item>
                  )
                }else{
                  return (
                    <SubMenu 
                      title={sub.label}
                      key={sub.key}
                      icon={sub.icon}
                      children={
                      sub.children && sub.children.map((menuItem, menuIndex)=>{
                        if (menuItem.label === '职员管理' && sessionStorage.getItem('isManage') === '1'){
                          return null
                        }else{
                        return(
                          <Item index={menuIndex} key={menuItem.key}>
                            <NavLink to={menuItem.path} onClick={()=>{
                              const data={label: menuItem.label, path: menuItem.path}; 
                              // console.log("data----->", data);
                              // 通过消息订阅与发布传参, 同时修改兄弟组件的状态
                              PubSub.publish('data', data)
                            }}>{menuItem.label}</NavLink>
                          </Item>
                      
                      )}})}>
                </SubMenu>
              )}})}
            </Menu>
        </Sider>
      </div>
    )
  }
  