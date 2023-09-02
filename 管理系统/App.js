import { Layout, Space } from 'antd';
import { Routes, Route } from 'react-router-dom';
import Nav from './component/Nav'
import Headers from './component/Headers'
import Tables from './component/Tables'
import BuyTable from './pages/BuyTable';
import Home from './pages/Home';
// const { Content } = Layout;
// const contentStyle = {
//   textAlign: 'center',
//   minHeight: 120,
//   lineHeight: '120px',
//   color: '#fff',
//   // backgroundColor: '#108ee9',
// };
const App = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
      height: '100%',
    }}
    size={[0, 48]}
  >

    <Layout >
      {/* <Sider style={siderStyle}>Sider</Sider> */}
      <Nav />
      <Layout style={{height: '100%', background: "white"}}>
        {/* <Header style={headerStyle}></Header> */}
        <Headers />
        <Tables />
        {/* <Footer style={footerStyle}>Footer</Footer> */}
      </Layout>
    </Layout>
    <Routes>
      <Route path='*' element={<Home />}/>
      <Route path='/saletable' element={<BuyTable />} />
    </Routes>
  </Space>
);
export default App