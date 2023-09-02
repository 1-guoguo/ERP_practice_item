// 商品信息表
import { Tag, Table, Layout, Space, Popconfirm, Row, Col, Input, Select, Form, Button, Modal, Spin  } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const { Content } = Layout;
const {Search} = Input

function CustomerTables () {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { setFieldsValue, getFieldsValue } = form;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [dataStatus, setDataStatus] = useState(false);  // 标记数据是否改变
  const [make, setMake] = useState(0)  // 标记操作类型，默认为0
  const [openStatus, setOpenStatus] = useState(false)  // 标记表单是否禁用，只有查看的时候禁用，修改不禁用
  const [spinning, setSpinning] = useState(true)
  const onShowFill = (id) => {
    // 根据所选行的id发送get请求，获取当前行的数据
    console.log(id)
    setOpen(true)
    setMake("查看客户信息")
    setOpenStatus(true)
    axios.post('http://127.0.0.1:8000/customer/searchId/', id, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response.data[0])
            let data = response.data[0]
            setTimeout(()=>{
                // 数据回显之前就要对日期格式进行设置，设置为dayjs格式
                form.setFieldsValue({...data, status: (data.status ? '未启用':'启用')})  // 将该行数据设置为表单数据
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
    setMake("修改客户信息")
    setOpenStatus(false)
    axios.post('http://127.0.0.1:8000/customer/searchId/', id, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            let data = response.data[0]
            form.setFieldsValue({...data, status: (data.status ? '未启用':'启用')})  // 将该行数据设置为表单数据
            console.log(getFieldsValue())
        }
    ).catch(
        err=>console.log(err)
    )

  }
  const columns = [
    {
      title: '单位编号',
      // key:'saleOrderId',
      key:'customerNo',
      dataIndex: 'customerNo',
      align: 'center',
    },
    {
      title: '单位名称',
      key: 'customerName',
      dataIndex: 'customerName',
      align: 'center',
    },
    {
      title: '联系人',
      key: 'contacts',
      dataIndex: 'contacts',
      align: 'center',
    },
    {
      title: '手机号',
      key: 'mobile',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '客户地址',
      key: 'customerAddress',
      dataIndex: 'customerAddress',
      align: 'center',
    },
    {
        title: '状态',
        key:'status',
        dataIndex: 'status',
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
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          <a onClick={()=>{onShowFill(record.id)}}>查看</a>
          <a onClick={()=>{onAlterFill(record.id)}}>修改</a>
          {dataSource.length >= 1 ? (
            <>
              <Popconfirm title="确定删除吗?" cancelText='取消' okText='确定' onConfirm={() => handleDelete(record.key)}>
                <a>删除</a> 
              </Popconfirm>
            </>) : null}
        </Space>
      ),
    }
  ];
  useEffect(()=>{
    // 进行ajax请求
    axios.get('http://127.0.0.1:8000/customer/getCustomer').then(
      response=>{
        setDataSource(response.data)
        setSpinning(false)
      }
    )

  }, [dataStatus])
//   删除功能
  const handleDelete = (key) => {
    console.log(key)
    // 通过id删除，使用post请求
    axios.post('http://127.0.0.1:8000/customer/deleteId/', key, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response)
            // 设置新的数据源
            setDataStatus(!dataStatus)
        }
    ).catch(
        err=>console.log(err)
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
  //   提交表单且数据验证成功调用事件
  const onFinish = (values) => {
    console.log(values)
    if (values.customerNo){
        console.log(values.status)
        console.log(values)
        axios.post('http://127.0.0.1:8000/customer/alter/', values, {headers: {'Content-Type': 'application/json'},}).then(
            response=>{
                console.log(response)
                setDataStatus(!dataStatus)
                setOpen(false)
            }
        ).catch(
            err=>console.log(err)
        )
    }else{  
    axios.post('http://127.0.0.1:8000/customer/addPost/', values, {headers: {'Content-Type': 'application/json'},}).then(
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
        axios.post('http://127.0.0.1:8000/suatomer/searchValue/', params, {headers: {'Content-Type': 'application/json'},})
        .then(
            response=>{
                console.log(response)
                if(value===''){
                    navigate('/customermanage')
                    setDataStatus(!dataStatus)
                }else{
                    // 展示到页面上
                    navigate(`/cuatomermanage?value=${value}`)
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
    axios.post('http://127.0.0.1:8000/customer/searchStatus/', params, {headers: {'Content-Type': 'application/json'},})
    .then(
        res=>{
            console.log("请求", res)
            if(res.data.msg === '缺少参数')
            {
                navigate('/customermanage')
                setDataStatus(!dataStatus)
            }
            else{
                // 展示到页面上
                navigate(`/customermanage?status=${value}`)
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
      <h2 style={{textAlign: 'center'}}>客户管理</h2>
      <Row style={{marginBottom: 10}}>
        <Col span={12}>
        <Search allowClear style={{width: 300, marginLeft: 10}} size='middle' placeholder="请输入客户编号/供应商名称" onSearch={onSearch} />
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
            <Button onClick={()=>{setOpen(true);setMake('添加客户信息');setOpenStatus(false);form.resetFields()}}>添加客户</Button>
        </Col>
      </Row>
      <Spin spinning={spinning}>
      <Table rowKey={(record)=>record.id} rowSelection={rowSelection} columns={columns} dataSource={dataSource}/>
      </Spin>
        <Modal title={make} footer={false} centered onCancel={()=>{setOpen(false)}} open={open} width={'55%'}>
            <Form name="basic" form={form} labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} layout="inline"
            // style={{
            //     maxWidth: 600,
            // }}
            initialValues={{
                remember: true,
            }}
            autoComplete="off"
            onFinish={onFinish}
            disabled={openStatus}
            style={{marginTop: 20}}
            >
                <Row style={{width: '100%'}}>
                    <Col span={12}>
                        <Form.Item label='客户编号' name='customerNo'style={{width: '100%'}}>
                            <Input placeholder='客户编号自动生成' disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='客户名称' rules={[{required: true, message: '请输入客户名称'}]} name='customerName' style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='联系人' name='contacts' rules={[{required: true, message: '请输入公司地址'}]} style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='手机号' name='mobile' rules={[{required: true, message: '请输入手机号'}]} style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='客户地址' name='customerAddress' rules={[{required: true, message: '请输入公司地址'}]} style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='状态' name='status' rules={[{required: true, message: '请输入状态'}]} style={{width: '100%'}}>
                        <Select
                            style={{
                                width: 120,
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
                <Row style={{marginTop: 15, marginLeft: 600}}>
                    <Button type="primary" htmlType='submit' >
                        保存    
                    </Button> 
                    <Button htmlType='button' onClick={()=>{setOpen(false)}} style={{marginLeft: 10}}>
                        取消
                    </Button>
                </Row>
            </Form>
        </Modal>
    </Content>
  );
};
export default CustomerTables;
