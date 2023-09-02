import React, { Component } from 'react'
import { Layout } from 'antd';
const { Content } = Layout;

export default class Home extends Component {
  render() {
    console.log("我是主页")
    return (
      <Content className='contentStyle'>
        <div>我是Home主页</div>
      </Content>
      
    )
  }
}
