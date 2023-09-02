import React, {useState} from 'react';
import {
  DownOutlined,
} from '@ant-design/icons';
import { Layout, Tree, theme } from 'antd';
// import { Content } from 'antd/es/layout/layout';
import SupplierTable from '../Detail/SupplierTable'
import CustomerTable from '../Detail/CustomerTable'

const { Content, Sider } = Layout
const treeData = [
  {
    title: '供应商/客户管理',
    key: '0-0',
    // icon: <SmileOutlined />,
    children: [
      {
        title: '供应商管理',
        key: 'suppliermanage',
        // icon: <MehOutlined />,
      },
      {
        title: '客户管理',
        key: 'customermanage',
        // icon: ({ selected }) => (selected ? <FrownFilled /> : <FrownOutlined />),
      },
    ],
  },
];

export default function Node() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [flag, setFlag] = useState(true)

  const onSelect = (selectedKeys) => {
    if (selectedKeys[0] === 'suppliermanage'){
      setFlag(true)
    }else if(selectedKeys[0] === 'customermanage'){
      setFlag(false)
    }
  }

  return (
  <Layout>
    <Sider width={200} style={{background: colorBgContainer}}>
      <Tree
      showIcon
      defaultExpandAll
      defaultSelectedKeys={['suppliermanage']}
      switcherIcon={<DownOutlined />}
      treeData={treeData}
      onSelect={(selectedKeys)=>{onSelect(selectedKeys)}
    }
    />
    </Sider>
  <Content style={{background: colorBgContainer}}>
    {flag ? <SupplierTable /> : <CustomerTable /> }

  </Content>
  </Layout>
  )
};