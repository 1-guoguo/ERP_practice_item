import React, { Component } from 'react'
import { Layout } from 'antd';
const { Content } = Layout;

export default class Home extends Component {
  render() {
    return (
      <Content>
        <div>
          {sessionStorage.getItem('loginStatus') ? '我是home主页' : '还未登录，点击右上方登录'}
        </div>
      </Content>
      
    )
  }
}
