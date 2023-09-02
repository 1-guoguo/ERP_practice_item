import React from "react"
import { Layout, Dropdown, Row, Col, Space, message } from "antd"
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import './index.css'
const { Header } = Layout
const headerStyle =  {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
};



export default function Head (){
    // sessionStorage.setItem('loginStatus', false)
    const navigate = useNavigate()
    // useEffect(()=>{
    //     console.log("进来了")
    // }, [])
    const onClick = () => {
      // 点击退出，清除session的信息
      sessionStorage.clear()
      // 调用接口，清楚djangoSession的信息
      axios.get('http://127.0.0.1:8000/user/loginOut/').then(
        response=>{
          message.success(response.data.msg)
        }
      )
    }
    const items = [
      {
        key: '1',
        label: sessionStorage.getItem('loginName') + '，你好！'
      },
      {
        key: '2',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            个人中心
          </a>
        ),
      },  
      {
        type: 'divider'
      },
      {
          key: '3',
          label: (
            <NavLink to='/login' onClick={onClick}> 退出 </NavLink>
          ),
        },
  ];
    const onLogin = (e) => {
        // 点击登录跳转登录页
        // 如果点击获得的是登陆，就跳转，否则阻止事件发生
        navigate('/login')
        e.preventDefault()
        
    }

    return(
        <Header style={headerStyle}>
                <Row>
                  <Col span={2} offset={23}>
                    <Dropdown menu={{ items,}} placement="bottom" trigger={['hover']} onClick={onLogin}>
                      {/* 如果登录成功，登录二字换成登录的用户名style={{fontSize:24, color:'white'} */}
                      {/* <span> */}
                      <Space>
                        {sessionStorage.getItem('loginStatus')==='true' ? <span><UserOutlined />&nbsp;&nbsp;
                                                                          {sessionStorage.getItem('loginName')}</span>
                                                                           : '登录'}  
                        {/* </span> */}
                        <DownOutlined style={{color:'white'}}  />
                      </Space>
                    </Dropdown>
                  </Col>
                </Row>
        </Header>
    )
} 
