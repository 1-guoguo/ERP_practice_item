// 销售订单管理
import { Select, Tag, Modal, Table, Layout,InputNumber, Space, Popconfirm, Drawer, Button, Form,Row, Col, DatePicker, Divider, Input, Spin  } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './SaleOutstorage.css'
const { Content } = Layout;
const { Search } = Input;
const orderType = ['销售订单', '采购订单']
const orderStatus = ['内容待审核','内容审核中','内容审核已通过','内容审核未通过','订单已确定']

function SaleManagementTable () {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([])  // 首页列表数据源
  const [open, setOpen] = useState(false) // 打开抽屉状态
  const [openModal, setOpenModal] = useState(false)  // 打开商品明细模态框状态
  const [dataStatus, setDataStatus] = useState(false);  // 标记数据是否改变
  const [storeModal, setStoreModal] = useState(false) // 商品信息模态框
  const [storeData, setStoreData] = useState([])  // 商品信息数据源
  const [messageData, setMessageData] = useState([])  // 设置查看商品信息数据源
  const [listData, setListData] = useState([])  // 模态框商品列表数据源
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [choiceId, setChoiceId] = useState([])  // 设置商品信息选择id
  const [choiceStore, setChoiceStore] = useState([])  // 设置商品选择信息
  const [make, setMake] = useState(0)
  const [spinning, setSpinning] = useState(true)
  // 查看商品信息模态框ok
  const handleOk = (e) => {
    setConfirmLoading(true);
    console.log(e)
    // 获取选中的数据
    setTimeout(() => {
      setOpenModal(false);
      setConfirmLoading(false);
    }, 1000);
  };
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpenModal(false);
  };
  // 查看订单商品明细
  const onClick = (id) => {
    const data = dataSource.filter((item)=>item.id !== id);
    console.log("data",data);
    setOpenModal(true)
    axios.post('http://127.0.0.1:8000/saleOrder/getId/', id, {headers: {'Content-Type': 'application/json'}}).then(
      res=>{
        console.log("res",res.data)
        setMessageData(res.data)
      }
    ).catch(
      err=>console.log(err)
    )
  }
  // 修改数据，打开抽屉
  const onAlterFill = async (id) => {
    // 根据所选行的id发送get请求，获取当前行的数据
    console.log(id)
    setOpen(true)
    setMake("修改销售订单")
    axios.post('http://127.0.0.1:8000/saleOrder/getId/', id, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response.data[0])
            let data = response.data[0]
            // 通过获得的goosId获得商品信息
            let goodsId = response.data[0]['goodsNo']
            console.log("cons",goodsId)
            const params = {
              value: goodsId
            }
            axios.post('http://127.0.0.1:8000/store/searchValue/', params, {headers: {'Content-Type': 'application/json'},}).then(
              res=>{
                setListData(res.data)
                // 商品信息存在choiceStore中
                setChoiceStore(res.data)
              }
            )

            
            // 数据回显之前就要对日期格式进行设置，设置为dayjs格式
            form.setFieldsValue({...data, doneStatus: (data.doneStatus ? '已完成':'未完成'), orderTime: dayjs(data.orderTime), deliveryDate: dayjs(data.deliveryDate), orderType: orderType[data.orderType], orderStatus: orderStatus[data.orderStatus]})  // 将该行数据设置为表单数据
            console.log(form.getFieldsValue())
        }
    ).catch(
        err=>console.log(err)
    )

  }
  // 销售订单列表
  const columns = [
    {
      title: '销售订单编号',
      // key:'saleOrderId',
      key:'orderNo',
      dataIndex: 'orderNo',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '订单时间',
      key: 'orderTime',
      dataIndex: 'orderTime',
      fixed: 'left',
      align: 'center',
    },
    {
      title: '交货日期',
      key:'deliveryDate',
      dataIndex: 'deliveryDate',
      align: 'center',
    },
    {
      title: '购买单位',
      key:'purchaseUnit',
      dataIndex: 'purchaseUnit',
      align: 'center',
    },
    {
      title: '所属地区',
      key:'address',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '订单状态',
      key:'orderStatus',
      dataIndex: 'orderStatus',
      align: 'center',
      render: (_, record)=>{
        let status = ['内容待审核', '内容审核中', '内容审核不通过', '内容审核已通过', '订单已确定']
        if (status[record.orderStatus] === '订单已确定')
        {
          return <Tag color='green'>{status[record.orderStatus]}</Tag>
        }else{
          return <Tag color='blue'>{status[record.orderStatus]}</Tag>
        }
        
      }
    },
    {
      title: '(发货)仓库',
      key:'warehouseName',
      dataIndex: 'warehouseName',
      align: 'center',
    },
    {
      title: '订货数量',
      key:'orderQuantity',
      dataIndex: 'orderQuantity',
      align: 'center',
    },
    {
      title: '完成数量',
      key:'doneQuantity',
      dataIndex: 'doneQuantity',
      align: 'center',
    },
    {
      title: '差异数量',
      key:'diffQuantity',
      dataIndex: 'diffQuantity',
      align: 'center',
    },
    {
      title: '完成状态',
      key:'doneStatus',
      align: 'center',
      dataIndex: 'doneStatus',
      render: (_, record) => {
        if (record.doneStatus === 0){
          return <Tag color='red'>未完成</Tag>
        }else{
          return <Tag color='green'>已完成</Tag>
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 250,
      render: (_, record) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          {/* 查看订单商品明细*/}
          <a onClick={()=>onClick(record.id)}>查看</a>  
          <a onClick = {()=>onAlterFill(record.id)}>修改</a>
          {dataSource.length >= 1 ? (
            <>
              <Popconfirm title="确定删除吗?" cancelText='取消' okText='确定' onConfirm={() => handleDelete(record.id)}>
                <a>删除</a> 
              </Popconfirm>
            </>) : null}
        </Space>
    )
   }
  ];
  // 抽屉订单列表
  const orderColumns = [
    {
      title: '商品名称',
      // key:'saleOrderId',
      key:'tradeName',
      dataIndex: 'tradeName',
    },
    {
      title: '商品编号',
      key: 'tradeNo',
      dataIndex: 'tradeNo',
    },
    // 要标记是否可见，当点击查看，不可见，其余均可见
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return(
            <Popconfirm title="确定删除吗?" cancelText={'取消'} okText={'确定'}
              onConfirm={() => {const newData = listData.filter((item) => item.id !== record.id);
                console.log(newData)
                setListData(newData)}}  >
              {/* // <a onClick={()=>{
              //   const newData = listData.filter((item) => item.id !== record.id);
              //   console.log(newData)
              //   setListData(newData) */}
              <a>删除</a>
            </Popconfirm>
        )
      }
    }
  ]
  // 模态框查看订单商品列表
  const itemColumns = [
    {
      title: '仓库',
      key:'warehouseName',
      dataIndex: 'warehouseName',
    },
    {
      title: '订货数量',  // 数量
      key:'orderQuantity',
      dataIndex: 'orderQuantity',
    },
    {
      title: '商品名称',
      key:'tradeName',
      dataIndex: 'tradeName',
    },
    {
      title: '商品编号',
      key:'goodsNo',
      dataIndex: 'goodsNo',
    },
    {
      title: '订货数量',  // 商家订货的数量
      key:'orderQuantity',
      dataIndex: 'orderQuantity',
    },
    {
      title: '订单备注', 
      key:'review',
      dataIndex: 'review',
    }
  ]
  // 模态框添加商品列表
  const storeColumns = [
    {
      title: '商品名称',
      // key:'saleOrderId',
      key:'tradeName',
      dataIndex: 'tradeName',
    },
    {
      title: '商品编号',
      key: 'tradeNo',
      dataIndex: 'tradeNo',
    },
    {
      title: '品牌',
      key:'brand',
      dataIndex: 'brand',
    },
    {
        title: '规格',
        key:'specification',
        dataIndex: 'specification',
    },
    {
        title: '型号',
        key:'model',
        dataIndex: 'model',
    },
    {
        title: '状态',
        key:'status',
        dataIndex: 'status',
        render: (_, { status }) => {
            if (status === 0){
                return <Tag color='green'>启用</Tag>
            }else{
                return <Tag color='red'>未启用</Tag>
            }
        }
    },
  ];
  useEffect(()=>{
    // 进行ajax请求
    axios.get('http://127.0.0.1:8000/saleOrder/getSaleOrder').then(
      response=>{
        setDataSource(response.data)
        setSpinning(false)
      }
    )

  }, [dataStatus])
  // 删除
  const handleDelete = (key) => {
    console.log(key)
    axios.post(`http://127.0.0.1:8000/saleOrder/delete/`, key, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response)
            // 设置新的数据源
            setDataStatus(!dataStatus)
        }
    ).catch(
        err=>console.log(err)
    )
  }
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    console.log('select', selectedRows)
    setChoiceStore(selectedRows)
    setChoiceId(newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  // 搜索框事件
  const onSearch = (value) => {
    const params = {
        value: value
    }
    console.log(params)
    axios.post('http://127.0.0.1:8000/saleOrder/searchValue/', params, {headers: {'Content-Type': 'application/json'},})
    .then(
        response=>{
            console.log(response)
            if(value===''){
                navigate('/salemanagement')
                setDataStatus(!dataStatus)
            }else{
                // 展示到页面上
                navigate(`/salemanagement?value=${value}`)
                // 请求到的数据进行展示
                setDataSource(response.data)
            }
        }
    ).catch(
        error=>console.log(error)
    )
  }
  // 商品信息点击确定触发事件
  const onOk = () => {
    // 将选择到的数据放入表格
    setListData(choiceStore)
    setStoreModal(false);
  }
  // 抽屉保存触发事件
  const onFinish = (values) => {
    console.log("values", values)
    console.log("values", choiceStore)
    let formvalue = new Object()
    formvalue.goodsNo = choiceStore[0]['tradeNo']
    console.log(formvalue)
    console.log(choiceStore)
    const value = {...values, orderTime: dayjs(values.orderTime).format('YYYY-MM-DD'),deliveryDate: dayjs(values.deliveryDate).format('YYYY-MM-DD'), ...formvalue}
    console.log(value)
    if (values.orderNo){
      axios.post('http://127.0.0.1:8000/saleOrder/alter/', value, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
          console.log(response)
          setDataStatus(!dataStatus)
          setOpen(false)
      }
      ).catch(
        err=>console.log(err)
      )
    }else{
      
      axios.post('http://127.0.0.1:8000/saleOrder/addData/', value, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
          console.log(response)
          setDataStatus(!dataStatus)
          setOpen(false)
      }
      ).catch(
        err=>console.log(err)
      )
    }
    
  }
  // 订单状态
  const options = [
    {
      value: '0',
      label: '内容待审核'
    },
    {
      value: '1',
      label: '内容审核中'
    },
    {
      value: '2',
      label: '内容审核不通过'
    },
    {
      value: '3',
      label: '内容审核已通过'
    },
    {
      value: '4',
      label: '订单已确定'
    },
  ]
  // 订单类型
  const optionType = [
    {
      value: '0',
      label: '销售订单'
    },
    {
      value: '1',
      label: '采购订单',
    },
  ]
  return (
    <Content className='contentStyle'>
      <Row style={{marginBottom: '5px'}}>
            <Col span={8}>
                <Search style={{width: 300,marginLeft:10}} allowClear placeholder="请输入订单编号" onSearch={onSearch} />
            </Col>
            <Col span={3} offset={12}>
                <Button onClick={()=>{setOpen(true);setMake('新增销售订单');form.resetFields();setListData([])}}>新增销售订单</Button>
            </Col>
      </Row>
      {/* 首页列表 */}
      <Spin spinning={spinning}>
      <Table sticky rowKey={(record)=>record.id} rowSelection={rowSelection} columns={columns} dataSource={dataSource} scroll={{x: 1500,}}/>
      </Spin>
      <Drawer title={make} placement="right" onClose={()=>setOpen(false)} open={open} width={'55%'}>
        <Form name="basic" form={form} labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} layout="inline"
        // initialValues={{
        //     remember: true,
        // }}
        onFinish={onFinish}
        autoComplete="off"
        >
          <Row style={{width: '100%',marginBottom: 10}}>
            <Col span={12}>
            <Form.Item
                  label="销售订单编号"
                  name="orderNo"
              >
                <Input placeholder='销售订单编号自动生成' disabled/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  label="购买单位"
                  name="purchaseUnit"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{width: '100%', marginBottom: 10}}>
            <Col span={12}>
              <Form.Item
                label="发货仓库"
                name="warehouseName"
              >
                <Input />
              </Form.Item>
            </Col>
              <Col span={12}>
                <Form.Item
                  label="交货日期"
                  name="deliveryDate"
                >
                  <DatePicker style={{width: '100%'}}
                            locale={locale}
                            placeholder='年-月-日' onChange={(value, dataString)=>console.log("value", typeof(dataString))}
                            format={'YYYY-MM-DD'}
                             />
                </Form.Item>
              </Col>
          </Row>
          <Row style={{width: '100%', marginBottom: 10}}>
            <Col span={12}>
                <Form.Item
                  label="所属地区"
                  name="address"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="订货数量"
                  name="orderQuantity"
                >
                  <InputNumber style={{width: 250}} />
                </Form.Item>
              </Col>
          </Row>
          <Row style={{width: '100%', marginBottom: 10}}>
            <Col span={12}>
                <Form.Item
                  label="完成数量"
                  name="doneQuantity"
                >
                  <InputNumber style={{width: 250}} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="金额"
                  name="saleAccount"
                >
                  <InputNumber style={{width: 250}} />
                </Form.Item>
              </Col>
          </Row>
          <Row style={{width: '100%', marginBottom: 10}}>
              <Col span={12}>
                <Form.Item
                  label="订单类型"
                  name="orderType"
                >
                  <Select placeholder='选择类型' allowClear options={optionType} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="订单状态"
                  name="orderStatus"
                >
                  <Select placeholder='选择一种状态' allowClear options={options} />
                </Form.Item>
              </Col>
          </Row>
          <Row style={{width: '100%', marginBottom: 10}}>
              <Col span={12}>
                <Form.Item
                  label="订单完成状态"
                  name="doneStatus"
                  style={{width: '100%'}}
                >
                  <Select
                    style={{
                      width: '245px',
                    }}
                    onChange={(value)=>console.log(value)}
                    options={[
                    {
                      value: '0',
                      label: '未完成',
                    },
                    {
                      value: '1',
                      label: '已完成',
                    },
                    ]}
                        />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item
                  label="经手人"
                  name="handerBy"
                >
                  <Input />
                </Form.Item>
              </Col>
          </Row>
          <Row style={{width: '100%'}}>
              <Col span={12}>
                <Form.Item
                  label="备注"
                  name="review"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="订单时间"
                  name="orderTime"
                >
                  <DatePicker style={{width: '100%'}}
                            locale={locale}
                            placeholder='年-月-日' onChange={(value, dataString)=>console.log("value", typeof(dataString))}
                            format={'YYYY-MM-DD'}
                             />
                </Form.Item>
              </Col>
          </Row>
          <Divider />
          {/* 销售订单表格，点击查看的时候，会在表格显示相应的订单信息 */}
          {/* 添加一个按钮，点击按钮的时候，会添加商品信息 */}
          <Button type='primary' style={{marginBottom: 10}} onClick={()=>{axios.get('http://127.0.0.1:8000/store/getStore/').then(response=>{console.log(response);setStoreData(response.data);setStoreModal(true);})}}>
            点击添加
          </Button>
          {/* <Row style={{width: '100%',}}> */}
          {/* <Col span={24}> */}
          {/* <Form.Item style={{width: '100%',}}  name="goodsNo"> */}
            <Table 
            columns={orderColumns} dataSource={listData} style={{width: '100%'}} />
          {/* </Form.Item> */}
          {/* </Col> */}
          {/* </Row> */}
          <Row style={{width: '100%',}}>
            <Col span={24}>
              <Button type="primary" htmlType='submit' >
                保存    
              </Button> 
              <Button htmlType='button' onClick={()=>{setOpen(false)}} style={{marginLeft: 10}}>
                取消
              </Button>
              </Col>
            
          </Row>
        </Form>
      </Drawer>
      {/* 订单商品明细模态框 */}
      <Modal
        title="订单商品明细"
        centered
        open={openModal}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={'取消'}
        okText={'确定'}
        width={'55%'}

      >
        <Table columns={itemColumns} dataSource={messageData}/>
      </Modal>
      {/* 商品信息表模态框 */}
      <Modal
        title="商品信息表"
        centered
        open={storeModal}
        onOk={onOk}  // 点击确定的时候，保存选中的信息到表格中
        confirmLoading={confirmLoading}
        onCancel={()=>{setStoreModal(false)}}
        cancelText={'取消'}
        okText={'确定'}
        width={'55%'}>
          <Table rowKey={(record)=>record.id + dataSource.length} dataSource={storeData} rowSelection={rowSelection} columns={storeColumns}></Table>
      </Modal>
    </Content>
  ); 
};
export default SaleManagementTable;
