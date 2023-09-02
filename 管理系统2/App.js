import React, {Component, useState} from 'react';
import { Layout, Space } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import Nav from './component/Nav'
import Headers from './component/Headers'
import Tables from './component/Tables'
import BuyTable from './pages/BuyTable';
import Home from './pages/Home';
const { Header } = Layout;
const headerStyle = {
  // textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
};


function App  () {

  const [tabData, setTabData] = useState('主页')

  const onTabData = (data) => {
    setTabData(data)
  }

  return(
    <Space
      direction="vertical"
      style={{
      width: '100%',
      height: '100%',
    }}
    // size={[0, 48]}
    >

    <Header style={headerStyle}>这里是我的登录，注册条幅</Header>
    <Layout >
      <Nav onTabData={onTabData}/>
      <Layout style={{height: '100%', background: "white"}}>
        <Headers tabData={tabData}/>
        <Routes>
          <Route path='*' element={<Navigate to='/home' />}/>
          <Route path='/home' element={<Home />} />
          <Route path='/saletable' element={<BuyTable />} />
        </Routes>
      </Layout>
    </Layout>
    
  </Space>
  )
  };
export default App;