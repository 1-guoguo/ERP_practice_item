// 该页面是登录页面
import React, { useState } from 'react';
import { Button, Form, Input, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Captcha from './Captcha';
import axios from 'axios';
import './index.css'
function Login () {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)   // 设置登录状态
  const onFinish = (values) =>{
    console.log("success", values)
    let url='http://127.0.0.1:8000/user/login/'
    axios.post(url, values, {headers: {'Content-Type': 'application/json'},})
    .then(
      response => {
        console.log("123", response)

        if(response.status === 200 && response.data.code === 200){
              // console.log("登录成功")
              // 取出用户名
              const loginName = response.data.name
              const isManage = response.data.isManage
              console.log("loginName", loginName)
              // 把用户名存储在key中
              sessionStorage.setItem('loginName', loginName)
              sessionStorage.setItem('loginStatus', true)
              // 将管理员状态存入session
              sessionStorage.setItem('isManage', isManage)
              // 设置登录状态
              setSuccess(true)
              navigate('/home')
              message.success('登录成功')
        }
        else{
          console.log("登录失败", response.data.msg)
          message.error(response.data.msg)
        }
      }
    )
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const onClick = () => {
    navigate('/register')
  }
  return(
    <div className='border'>
      <h1 className='title'>登录</h1>
      <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* <Form.Item
        label="公司名称"
        name="company"
        rules={[{ required: true, message: '请输入公司名' }]}
      >
        <Input />
      </Form.Item> */}
      <Form.Item
        label="用户名"
        name="loginName"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="loginPassword"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password />
      </Form.Item>
       {/* <Form.Item
        label="验证码"
        name="code"
        rules={[{ required: true, message: '请输入验证码' }]}
      >
        <Row>
          <Col span={14}>
            <Input />
          </Col>
          <Col span={8} style={{marginLeft:4}}>
            <Captcha />
          </Col>
        </Row>
      </Form.Item>  */}
      {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 6, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}
      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Row>
          <Col span={8}>
            <Button type="primary" htmlType="submit" >
            登录
            </Button>
          </Col>
          <Col span={8} offset={8}>
            <Button type="primary" onClick={onClick}>
              注册
            </Button>
          </Col>
        </Row>    
      </Form.Item>
      </Form>
      </div>
  )
  };

export default Login;