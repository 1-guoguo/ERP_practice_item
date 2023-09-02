import React, { useState } from 'react'
import { 
  MailOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined, MoneyCollectOutlined
 } from '@ant-design/icons';
// import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';

import './index.css'
const { Sider } = Layout;


  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items = [
    getItem('主页', '/home', <HomeOutlined />),
    getItem('销售管理', 'sub2', <MailOutlined />, [
      getItem('销售订单', null, null, [getItem('新增销售订单', '/saletable'), getItem('销售订单管理', '2')], 'group'),
      getItem('销售单据', null, null, [getItem('新增销售出库单', '3'), getItem('新增销售退货单', '4'), getItem('新增销售换货单', '5'), getItem('销售单据查询', '6')], 'group'),
    ]),
    getItem('采购管理', 'sub3', <AppstoreOutlined />, [
      getItem('采购订单', null, null, [getItem('新增采购订单', '7'), getItem('采购订单管理', '8')], 'group'),
      getItem('采购单据', null, null, [getItem('新增采购入库单', '9'), getItem('新增采购退货单', '10'), getItem('新增采购换货单', '11'), getItem('采购单据查询', '12')], 'group'),
    ]),
    getItem('仓库管理', 'sub4', <SettingOutlined />, [
      getItem('库存盘点', null, null, [getItem('新增盘点', '13'), getItem('盘点记录', '14'), getItem('盘点分析', '15')], 'group'),
      getItem('库存预警', null, null, [getItem('安全库存预警', '16'), getItem('保质期预警', '17'), getItem('负库存预警', '18')], 'group'),
      getItem('库存查询', null, null, [getItem('库存状况查询', '19'), getItem('可销售库存报表', '20'), getItem('分仓库存查询', '21')], 'group'),
      getItem('库存统计', null, null, [getItem('库存积压统计', '22'), getItem('库龄统计', '23'), getItem('商品进销存变动统计', '24'), getItem('批次号跟踪', '25')], 'group'),
    ]),
    getItem('财务管理', 'sub5', <MoneyCollectOutlined />, [
      getItem('发票管理', null, null, [getItem('开票信息管理', '26'), getItem('销项发票管理', '27'), getItem('进项发票管理', '28')], 'group'),
    ]),
    getItem('经营分析', 'sub6', <SettingOutlined />, [
      getItem('提成方案管理', '29'),
      getItem('历史提成记录', '30'),
      getItem('单据中心', '31'),
      getItem('单据审核中心', '32'),
    ]),
  ];

  
  export default function Nav(props) {
    console.log("propsssss",props)
    const { onTabData } = props 
    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate()

    const {
      token: { colorBgContainer },
      } = theme.useToken();
    
      const onClick = (e) => {
        console.log('click', e);
        console.log(e.domEvent.target.outerText)
        const { outerText:data } = e.domEvent.target
        navigate(e.key, { replace: true })
        // 进行消息发布，将我点击的那一项的名称传过去
        onTabData(data)
      };
    return (
      <div>
        <Sider className='siderStyle' style={{background: "white"}} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value) }>
        {/* <Sider> */}
          <div className='title' >
            <span style={{ marginLeft: 15, fontSize:'24px' }}>服装进销存系统</span>
          </div>
          <div className="demo-logo-vertical" />
            <Menu defaultOpenKeys={['sub1']} onClick={onClick} style={{width: 200,}} mode="vertical" items={items} />
        </Sider>
      </div>
    )
  }
  