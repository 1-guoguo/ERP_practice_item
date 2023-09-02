// 商品信息表
import { Spin, Table, Layout, Space, Popconfirm, Tag, Row, Col, Input, Select, Form, Drawer, Button, DatePicker  } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
const { Content } = Layout;
const {Search} = Input
dayjs.locale('zh-cn');
 
function Tables () {
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const { setFieldsValue, getFieldsValue } = form;  // setFieldsValue设置表单数据; getFieldsValue获取表单数据
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datasource, setDataSource] = useState([])  // 标记数据源
  const [open, setOpen] = useState(false)  // 标记是否打开弹窗
  const [make, setMake] = useState(0)  // 标记操作类型，默认为0
  const [dataStatus, setDataStatus] = useState(false)  // 标记数据是否改变
  const [openStatus, setOpenStatus] = useState(false)  // 标记表单是否禁用，只有查看的时候禁用，修改不禁用
  const [spinning, setSpinning] = useState(true)
  const onShowFill = (id) => {
    // 根据所选行的id发送get请求，获取当前行的数据
    console.log(id)
    setOpen(true)
    setMake("查看商品信息")
    setOpenStatus(true)
    axios.post('http://127.0.0.1:8000/store/searchId/', id, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response.data[0])
            let data = response.data[0]
            console.log(data.status)
            setTimeout(()=>{
                // 数据回显之前就要对日期格式进行设置，设置为dayjs格式
                form.setFieldsValue({...data, status: (data.status ? '未启用':'启用'), createTime: dayjs(data.createTime), expire_date: dayjs(data.expire_date)})  // 将该行数据设置为表单数据
                console.log(getFieldsValue())
                // 设置字段禁用
            },500)
            
        }
    ).catch(
        err=>console.log(err)
    )

  }
  const onAlterFill = (id) => {
    // 根据所选行的id发送get请求，获取当前行的数据
    console.log(id)
    setOpen(true)
    setMake("修改商品信息")
    setOpenStatus(false)
    axios.post('http://127.0.0.1:8000/store/searchId/', id, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response.data[0])
            let data = response.data[0]
            console.log(typeof(data.createTime))
            // 数据回显之前就要对日期格式进行设置，设置为dayjs格式
            form.setFieldsValue({...data, status: (data.status ? '未启用':'启用'), createTime: dayjs(data.createTime), expire_date: dayjs(data.expire_date)})  // 将该行数据设置为表单数据
            console.log(getFieldsValue())
        }
    ).catch(
        err=>console.log(err)
    )

  }
  const columns = [
    {
      title: '商品名称',
      // key:'saleOrderId',
      key:'tradeName',
      dataIndex: 'tradeName',
      width: 250,
      align: 'center',
    },
    {
      title: '商品编号',
      key: 'tradeNo',
      dataIndex: 'tradeNo',
      width: 150,
      align: 'center',
    },
    {
      title: '品牌',
      key:'brand',
      dataIndex: 'brand',
      width: 150,
      align: 'center',
    },
    {
        title: '规格',
        key:'specification',
        dataIndex: 'specification',
        width: 150,
        align: 'center',
    },
    {
        title: '型号',
        key:'model',
        dataIndex: 'model',
        width: 150,
        align: 'center',
    },
    {
        title: '状态',
        key:'status',
        dataIndex: 'status',
        width: 150,
        align: 'center',
        render: (_, { status }) => {
            if (status === 0){
                return <Tag color='green'>启用</Tag>
            }else{
                return <Tag color='red'>未启用</Tag>
            }
        }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          <a onClick={()=>{onShowFill(record.id)}}>查看</a>
          <a onClick={()=>{onAlterFill(record.id)}}>修改</a>
          {datasource.length >= 1 ? (
            <>
              <Popconfirm title="确定删除吗?" cancelText='取消' okText='确定' onConfirm={() => handleDelete(record.id)}>
                <a>删除</a> 
              </Popconfirm>
            </>) : null}
        </Space>
      ),
    }
  ];
  useEffect(()=>{
    // 进行ajax请求
    axios.get('http://127.0.0.1:8000/store/getStore/').then(
      response=>{
        console.log(response)
        setDataSource(response.data)
        setLoading(false)
        setSpinning(false)
      }
    )

  }, [dataStatus])
  
//   删除功能的实现
  const handleDelete = (key) => {
    console.log(key)
    // 通过id删除，使用post请求
    axios.post('http://127.0.0.1:8000/store/deleteId/', key, {headers: {'Content-Type': 'application/json'},}).then(
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
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
//   提交表单且数据验证成功调用事件
  const onFinish = (values) => {
    // 如果有商品编号，证明是修改，连接修改的接口
    // 如果没有商品编号，证明是新增，就调用新增的接口
    if (values.tradeNo){
        console.log(values.status)
        const value = {...values, createTime: dayjs(values.createTime).format('YYYY-MM-DD'), expire_date: dayjs(values.expire_date).format('YYYY-MM-DD')}
        console.log(value)
        axios.post('http://127.0.0.1:8000/store/alter/', value, {headers: {'Content-Type': 'application/json'},}).then(
            response=>{
                console.log(response)
                setDataStatus(!dataStatus)
                setOpen(false)
            }
        ).catch(
            err=>console.log(err)
        )
    }else{
        console.log(values.createTime)
        // 日期格式转换
        const value = {...values, createTime: dayjs(values.createTime).format('YYYY-MM-DD'), expire_date: dayjs(values.expire_date).format('YYYY-MM-DD')}
        console.log(value)
        axios.post('http://127.0.0.1:8000/store/addPost/', value, {headers: {'Content-Type': 'application/json'},}).then(
            response=>{
                console.log("response_post",response)
                // 更改数据状态
                setDataStatus(!dataStatus)
                // 关闭模态框
                setOpen(false)
            }
        ).catch(
            error=>console.log(error)
        )
    }
  }
//   搜索框事件
  const onSearch = (value) => {
        const params = {
            value: value
        }
        console.log(params)
        axios.post('http://127.0.0.1:8000/store/searchValue/', params, {headers: {'Content-Type': 'application/json'},})
        .then(
            response=>{
                console.log(response)
                if(value===''){
                    navigate('/storagemessage')
                    setDataStatus(!dataStatus)
                }else{
                    // 展示到页面上
                    navigate(`/storagemessage?value=${value}`)
                    // 请求到的数据进行展示
                    setDataSource(response.data)
                }
            }
        ).catch(
            error=>console.log(error)
        )
  }

//   状态选择事件
  const onChange = (value) => {
    const params = {
        status: value
    }
    console.log(value)
    axios.post('http://127.0.0.1:8000/store/searchStatus/', params, {headers: {'Content-Type': 'application/json'},})
    .then(
        res=>{
            console.log("请求", res)
            if(res.data.msg === '缺少参数')
            {
                navigate('/storagemessage')
                setDataStatus(!dataStatus)
            }
            else{
                // 展示到页面上
                navigate(`/storagemessage?status=${value}`)
                // 请求到的数据进行展示
                setDataSource(res.data)
            }
            
        }
    ).catch(
        err=>console.log(err)
    )
    

  }

  return (
    <Content className='contentStyle'>
      <Row style={{marginBottom: 10}}>
        <Col span={12}>
        <Search style={{width: 300, marginLeft: 10}} size='middle' placeholder="请输入商品编号/商品名称" onSearch={onSearch} allowClear />
        <Select
            showSearch
            style={{marginLeft: 5}}
            allowClear
            placeholder="选择一种状态"
            optionFilterProp="children"
            onChange={onChange}
            onSearch={value=>console.log(value)}
            filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
            {
                value: '0',
                label: '仅显示启用',
            },
            {
                value: '1',
                label: '仅显示停用',
            },
            ]}
            />
        </Col>
        <Col span={3} offset={9}>
            <Button onClick={()=>{setOpen(true);setMake("添加商品信息");setOpenStatus(false);form.resetFields()}}>添加商品</Button>
        </Col>
      </Row>
      <Spin spinning={spinning}>
        <Table  rowKey={(record)=>record.id} rowSelection={rowSelection}  columns={columns} dataSource={datasource}/>
      </Spin>
      <Drawer title={make} placement="right" onClose={()=>{setOpen(false)}} open={open} width={'55%'}>
            <Spin spinning={loading}>
            <Form name="basic" form={form} labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} layout="inline"
            // style={{
            //     maxWidth: 600,
            // }}
            // initialValues={{
            //     remember: true,
            // }}
            autoComplete="off"
            onFinish={onFinish}
            disabled={openStatus}
            >
                <h2>商品信息</h2>
                <Row style={{width: '100%'}}>
                    <Col span={12}>
                        <Form.Item label='商品编号' name='tradeNo' style={{width: '100%'}}>
                            <Input placeholder='商品编号自动生成' disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='商品名称' rules={[{required: true}]} name='tradeName' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='品牌' name='brand' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='规格' name='specification' style={{width: '100%'}}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='型号' name='model' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='状态' name='status' style={{width: '100%'}}>
                        <Select
                            // initialValue="0"
                            style={{
                                width: 265,
                                }}
                            onChange={(value)=>console.log(value)}
                            options={[
                                {
                                    value: '0',
                                    label: '启用',
                                },
                                {
                                    value: '1',
                                    label: '未启用',
                                },
                            ]}
                        />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='生产日期' name='createTime' style={{width: '100%'}} rules={[{required: true}]}>
                            <DatePicker style={{width: 265}}
                            locale={locale}
                            placeholder='年-月-日' onChange={(value, dataString)=>console.log("value", typeof(dataString))}
                            format={'YYYY-MM-DD'}
                             />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='到期日期' name='expire_date'  rules={[{required: true}]}>
                            <DatePicker style={{width: 265}}
                            locale={locale} 
                            placeholder='年-月-日' 
                            format={'YYYY-MM-DD'}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                
                <h2>仓库信息</h2>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='仓库' name='warehouseNo' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='仓内库存' name='inventory' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <h2>供应商信息</h2>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='供应商' name='supplier' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item label='供应商编号' name='supplierNo' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row> 
                <Row style={{marginTop: 100, marginLeft: 150}}>
                    <Button type="primary" htmlType='submit' >
                        保存    
                    </Button> 
                    <Button htmlType='button' onClick={()=>{setOpen(false)}} style={{marginLeft: 10}}>
                        取消
                    </Button>
                </Row>
                  
            </Form>
            </Spin>
      </Drawer>
    </Content>
  );
};
export default Tables;
