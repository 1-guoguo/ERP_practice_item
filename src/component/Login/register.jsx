import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Modal,
    Select,
    message,
  } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
};
const App = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const onFinish = (values) => {
      console.log('Received values of form: ', values);
      values.manage = values.userName
      values.manageNo = '00001'  // 一般第一个管理员编号都是00001
      console.log(values)
      // 写入数据库
      axios.post('http://127.0.0.1:8000/user/register/',values, {headers: {'Content-Type': 'application/json'},}).then(
        res=>{
          // 如果用户名重复，提示
          console.log(res.data)
          if (res.status===200 & res.data.code === 0){
            message.error(res.data.msg)
            console.log(res.data.msg)
          }else{
            message.success('注册成功')
            navigate('/login')
          }
        }
      ).catch(
        err=>console.log(err)
      )
    };

    return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="公司名称"
          rules={[
            {
              required: true,
              message: '请输入公司名',
            },

          ]}
        >
          <Input placeholder='公司名' />
        </Form.Item>
        <Form.Item
          name="companyNo"
          label="公司编号"
        >
          <Input placeholder='后台自动生成' disabled />
        </Form.Item>
        <Form.Item
          name="address"
          label="公司地址"
          rules={[
            {
              required: true,
              message: '请输入公司地址',
            },

          ]}
        >
          <Input placeholder='公司地址' />
        </Form.Item> 
        <Form.Item
          name="mobile"
          label="公司电话"
          // tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: '请输入公司电话',
              // whitespace: true,
            },
          ]}
        >
          <Input placeholder='公司电话'/>
        </Form.Item>
        <Button onClick={()=>{setOpen(true)}}>设置管理员信息</Button>
        <Modal title='设置超级管理员' open={open}
      //  footer={false}
          onOk={()=>setOpen(false)}
          centered onCancel={()=>setOpen(false)}>
        {/* <Form name="setManage" labelCol={{ span: 5, }} wrapperCol={{ span: 16, }} layout="inline"
            autoComplete="off"
            onFinish={onFinishManage}
            style={{marginTop: 20}}> */}
        <Form.Item
          name="userName"
          label="管理员名字"
          style={{width: '100%', marginTop: 5}}
          rules={[
            {
              required: true,
              message: '管理员名字',
            },
          ]}
        >
          <Input placeholder='管理员名字' />
        </Form.Item>
        <Form.Item
          name="userId"
          label="管理员编号"
          style={{width: '100%', marginTop: 5}}
        >
          <Input placeholder='后台自动生成' disabled />
        </Form.Item>
        <Form.Item
          name="loginName"
          label="登录用户名"
          style={{width: '100%', marginTop: 5}}
          rules={[
            {
              required: true,
              message: '请输入登录用户名',
            },
          ]}
        >
          <Input placeholder='登录用户名' />
        </Form.Item>
        <Form.Item label='手机号' name='phone' rules={[{required: true, message: '请输入手机号'}]} style={{width: '100%', marginTop: 5}}>
          <Input />
        </Form.Item>
        <Form.Item label='登录密码' name='loginPassword'
                  rules={[{required: true, message: '请输入密码'}]}
                  style={{width: '100%', marginTop: 5}}
                  hasFeedback>
          <Input.Password  />
        </Form.Item>
        <Form.Item label='确认密码' name='confirm'
                    dependencies={['loginPassword']}
                    rules={[
                      {required: true, message: '请输入密码'},
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('loginPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('与上次密码不匹配'));
                        },
                    }),]} 
                    style={{width: '100%', marginTop: 5}}>
            <Input.Password  />
        </Form.Item>
        <Form.Item label='登录范围' name='loginRound' style={{width: '100%', marginTop: 5}}>
          <Select defaultValue={'1'}  options={[{value: '0', label: '无登录权限'}, {value: '1', label: '全部'}]}></Select>
        </Form.Item>
        {/* <Col style={{marginTop: 10, marginLeft: 150}}>
        <Button type='primary' htmlType='submit'>确定</Button>
        <Button onClick={()=>setOpen(false)} style={{marginLeft: 10}}>取消</Button>
        </Col> */}
        
        {/* </Form> */}
      </Modal>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('必须接受')),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            确定注册
          </Button>
        </Form.Item>
      </Form>
      
    </>
    );
  };
  export default App;