// 销售单据查询
// 销售订单管理
import { Select, Modal, Dropdown, message, Table, Layout, Space, Popconfirm, Button, Form,Row, Col, Input, Tag, Spin  } from 'antd';
import { DownOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import axios from 'axios';
import PubSub from 'pubsub-js';
import SaleOutStorage from '../../pages/SaleOrder/SaleOutStorage'
import { useNavigate } from 'react-router-dom';
const { Content } = Layout;
const { Search } = Input;
function SaleQueryTable () {
  const navigate = useNavigate()
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([])
  const [openModal, setOpenModal] = useState(false)  // 打开模态框状态
  const [title, setTitle] = useState(0)
  const [itemData, setItemData] = useState([])
  const [dataStatus, setDataStatus] = useState(false)  // 设置首页数据状态
  const [spinning, setSpinning] = useState(true)
  const columns = [
    {
      title: '录单时间',
      key:'recordTime',
      dataIndex: 'recordTime',
      fixed: 'left',
      width: '120px',
      align: 'center',
    },
    {
      title: '单据编号',
      key:'documentsNo',
      dataIndex: 'documentsNo',
      fixed: 'left',
      width: '100px',
      align: 'center',
    },
    {
      title: '单据状态',
      key:'orderStatus',
      dataIndex: 'orderStatus',
      align: 'center',
      render: (_, record)=>{
        const status = [
          {'0': '已提交内容审核'},
          {'1': '内容已确认'},
          {'2': '待出/入库'},
          {'3': '已出/入库'},
          {'4': '核算完成'}
      ]
      return (
        <Tag color='lime'>{status[record.orderStatus][record.orderStatus]}</Tag>
      )
      }
    },
    {
      title: '单据类型',
      key:'type',
      dataIndex: 'type',
      align: 'center',
      render: (_, record)=>{
        const status = [
          {'0': '销售-销售出库'},
          {'1': '采购-采购退货'},
          {'2': '销售-销售退货'},
          {'3': '采购-采购入库'},
      ]
      if (record.type === 0 | record.type === 2){
        return (
          <Tag color='purple'>{status[record.type][record.type]}</Tag>
        )
      }
      else{
        return(
          <Tag color='orange'>{status[record.type][record.type]}</Tag>
        )
      }
      }
    },
    {
      title: '购买单位',
      key:'purchaseUnit',
      dataIndex: 'purchaseUnit',
      align: 'center',
    },
    {
      title: '退回单位',
      key:'returnUnit',
      dataIndex: 'returnUnit',
      align: 'center',
    },
    {
      title: '发货仓库',
      key:'outStorage',
      dataIndex: 'outStorage',
      align: 'center',
    },
    {
      title: '入库仓库',
      key:'inStorage',
      dataIndex: 'inStorage',
      align: 'center',
    },
    {
      title: '经手人',
      key:'handerBy',
      dataIndex: 'handerBy',
      align: 'center',
    },
    {
      title: '数量',
      key:'number',
      dataIndex: 'number',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: '150px',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          <a onClick={()=>{show(record)}}>查看</a>
          <a onClick={()=>{edit(record)}}>修改</a>
          {dataSource.length >= 1 ? (
            <>
              <Popconfirm title="确定删除吗?" cancelText='取消' okText='确定' onConfirm={() => handleDelete(record.id)}>
                <a>删除</a> 
              </Popconfirm>
            </>) : null}
        </Space>
      ),
    }
  ];
  const edit = (record) => {
    console.log("1111", record)
    // 数据发布到相应的单
    // 判断单据类型
    // 销售出库
    if(record.type === 0)  {
      // 跳转到销售出库单
      navigate('/saleoutrage')
      // 发布消息到销售出库单
      PubSub.publish('saleOutrage', record.documentsNo)
      // 发布消息到标签栏
      const data = {'label': '销售出库单', 'path': '/saleoutrage'}
      PubSub.publish('saleOutrage', data)
    }
    // 销售退货
    if(record.type === 2)  {
      // 跳转到销售退货单
      navigate('/salereturn')
      // 发布消息到销售退货单
      PubSub.publish('saleInstorage', record.documentsNo)
      // 发布消息到标签栏
      const data = {'label': '销售退货单', 'path': '/salereturn'}
      PubSub.publish('saleInstorage', data)
    }
  }
  useEffect(()=>{
    // 进行ajax请求
    axios.get('http://127.0.0.1:8000/documents/querySale').then(
      response=>{
        setDataSource(response.data)
        setSpinning(false)
      }
    )

  }, [dataStatus])
    //   新增单据下拉框菜单
  const items = [
        {
            label: '销售出库单',
            key: '0',
            path: '/saleoutrage',
            element: <SaleOutStorage />
        },
        {
            label: '销售退货单',
            key: '1',
            path: '/salereturn',
            // icon: <UserOutlined />,
        },
  ]
  const handleMenuClick = (e) => {
      message.info(`新增${items[e.key].label}`);
      // console.log('click', items[e.key].path);
      const data = items[e.key]
      // 消息发布
      PubSub.publish('sale', data)
      //跳转
      navigate(`${items[e.key].path}`)
  };
  const menuProps = {
      items,
      onClick: handleMenuClick,
  };
  // 点击删除事件
  const handleDelete = (key) => {
    console.log(key)
    const newData = dataSource.filter((item) => item.id !== key);
    console.log(newData)
    setDataSource(newData)
  }
  //   搜索框事件
  const onSearch = (value) => {
    const params = {
        value: value
    }
    console.log(params)
    axios.post('http://127.0.0.1:8000/documents/searchValue/', params, {headers: {'Content-Type': 'application/json'},})
    .then(
        response=>{
            console.log(response)
            if(value===''){
                navigate('/salequery')
                setDataStatus(!dataStatus)
            }else{
                // 展示到页面上
                navigate(`/salequery?value=${value}`)
                // 请求到的数据进行展示
                setDataSource(response.data)
            }
        }
    ).catch(
        error=>console.log(error)
    )
}
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 明细模态框列表项
  const item = [
    {
      title: '商品名称',
      key:'tradeName',
      dataIndex: 'tradeName',
      width: '100px',
      alian: 'center'
    },
    {
      title: '商品编号',
      key: 'tradeNo',
      dataIndex: 'tradeNo',
      width: '100px',
      alian: 'center'
    },
    {
      title: '品牌',
      key:'brand',
      dataIndex: 'brand',
      width: '100px',
      alian: 'center'
    },
    {
        title: '规格',
        key:'specification',
        dataIndex: 'specification',
        width: '100px',
        alian: 'center'
    },
    {
        title: '型号',
        key:'model',
        dataIndex: 'model',
        width: '100px',
        alian: 'center'
    },
    {
      title: '生产日期',
      key:'createTime',
      dataIndex: 'createTime',
      width: '100px',
      alian: 'center'
    },
    {
      title: '保质期',
      key:'sell_by_date',
      dataIndex: 'sell_by_date',
      width: '100px',
      alian: 'center'
    },
    {
      title: '到期日期',
      key:'expire_date',
      dataIndex: 'expire_date',
      width: '100px',
      alian: 'center'
    },
    {
      title: '数量',
      key:'number',
      dataIndex: 'number',
      width: '100px',
      alian: 'center'
    }
  ]
  // 选中一行通过订单号查看明细
  const show = (record) =>{
    if (record.type === 0 | record.type === 1){
      setTitle('查看出库明细')
      // 查看出库表
      axios.post('http://127.0.0.1:8000/store/showOut/', record.documentsNo, {headers: {'Content-Type': 'application/json'},}).then(
        res=>{
          const data = {...res.data[0], number: record.number}
          setItemData([data])
        }
      ).catch(
        err=>console.log(err)
      )
    }
    else{
      setTitle('查看入库明细')
      // 查入库表
      // 查看出库表
      axios.post('http://127.0.0.1:8000/store/showIn/', record.documentsNo, {headers: {'Content-Type': 'application/json'},}).then(
        res=>{
          const data = {...res.data[0], number: record.number}
          setItemData([data])
        }
      ).catch(
        err=>console.log(err)
      )
    }
    setOpenModal(true)

  }
  const options = [
    {
      value: '0',
      label: '已提交内容审核'
    },
    {
      value: '1',
      label: '内容已确认'
    },
    {
      value: '2',
      label: '待出/入库'
    },
    {
      value: '3',
      label: '已出/入库'
    },
    {
      value: '4',
      label: '核算完成'
    },
  ]
  const optionType = [
    {
      value: '0',
      label: '销售-销售出库单'
    },
    {
      value: '2',
      label: '销售-销售退货单',
    },
  ]
  const onFinish = (values) => {
    console.log("表单数据", values)
    let params = {
      values: values,
      flag: 0
    }
    // 发送请求进行模糊查询
    axios.post('http://127.0.0.1:8000/documents/search/', params, {headers: {'Content-Type': 'application/json'},}).then(
        res=>{
          console.log(res.data)
          setDataSource(res.data)
        }
    ).catch(
      err=>console.log(err)
    )
  }
  
  return (
    <Content className='contentStyle'>
        {/* Form表单，限定词查询 */}
      <Form name="search" 
            autoComplete="off"
            // onValuesChange={onFinish}
            onFinish={onFinish}>
        <Row style={{marginLeft: 10}}>
          <Col span={4} >
            <Form.Item name='orderStatus' label='单据状态'>
              <Select placeholder='选择一种状态' allowClear options={options}/>
            </Form.Item>
          </Col>
          <Col span={4}  style={{marginLeft: 10}}>
            <Form.Item name='type' label='单据类型'>
              <Select placeholder='选择类型' allowClear options={optionType}/>
            </Form.Item>
          </Col>
          <Col span={4}  style={{marginLeft: 10}}>
            <Form.Item name='purchaseUnit' allowClear label='购买单位'>
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}  style={{marginLeft: 10}}>
            <Form.Item name='handerBy' label='经手人' allowClear>
              <Input />
            </Form.Item>
          </Col>
          <Col span={4}  style={{marginLeft: 10}}>
            <Form.Item name='outStorage' label='仓库' allowClear>
              <Input />
            </Form.Item>
          </Col>

        </Row>
        <Row>
          <Col span={4}  style={{marginLeft: 10}}>
            <Form.Item name='returnUnit' label='退货单位' allowClear>
              <Input />
            </Form.Item>
          </Col>
          <Col span={2}  style={{marginLeft: 10}}>
            <Button type='primary' htmlType='submit'>查询</Button>
          </Col>
        </Row>
      </Form>
      <Row style={{marginBottom: '5px', marginLeft: '10px'}}>
        <Col span={2}>
            <Dropdown menu={menuProps}>
                <Button>
                    <Space>
                        新增单据
                        <DownOutlined />
                    </Space>
                </Button>
            </Dropdown>
        </Col>
        <Col span={8}>
            <Search style={{width: 300, marginLeft: 10}} allowClear placeholder="输入单据编号" onSearch={(value)=>onSearch(value)} />
        </Col>
      </Row>
      <Spin spinning={spinning}>
      <Table rowKey={record=>record.id} rowSelection={rowSelection} columns={columns} dataSource={dataSource} scroll={{
      x: 1300,}} sticky/>
      </Spin>
    <Modal
        title={title}
        centered
        open={openModal}
        onOk={()=>{setOpenModal(false)}}  // 点击确定的时候，保存选中的信息到表格中
        onCancel={()=>{setOpenModal(false)}}
        cancelText={'取消'}
        okText={'确定'}
        width={'55%'}>
          <Table columns={item} dataSource={itemData}></Table>
      </Modal>
    </Content>
  );
};
export default SaleQueryTable;
