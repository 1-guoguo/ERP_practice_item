// 用户信息表
import { Switch, Tag, Badge, Table, Layout,Spin, Space, Popconfirm, Row, Col, Input, Select, Form, Button, Modal, Divider, message  } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckOutlined, CloseOutlined, HolderOutlined } from '@ant-design/icons'
import axios from 'axios';
const { Content } = Layout;
const {Search} = Input

// 设置是否为登录用户，可折叠的部分
function User() {
const [openPass, setOpenPass] = useState(false)
const [manage, setManage] = useState(false)
  return (
    <>
    <Row style={{width: '100%'}}>
        <Col span={12}>
            <Form.Item label='登录名称' name='loginName' style={{width: '100%'}}>
                <Input />
            </Form.Item>
        </Col>
        <Button onClick={()=>setOpenPass(true)} style={{marginLeft: 5}}>设置密码</Button>
                
        <Col span={12} style={{marginTop: 10}}>
            <Form.Item label='登录范围' name='loginRound' style={{width: '100%'}}>
                <Select defaultValue="0"  options={[{value: '0', label: '无登录权限'}, {value: '1', label: '全部'}]}></Select>
            </Form.Item>
        </Col>
        <Col span={12} style={{marginTop: 10}}>
            <Form.Item label='设置管理员' name='manager' style={{width: '100%'}}>
                <Switch checked={manage} onClick={()=>setManage(!manage)}></Switch>
            </Form.Item>
        </Col>
    </Row>
        <Modal title='设置登录密码' width='30%' open={openPass} onOk={()=>{setOpenPass(false)}} okText={'确认'} cancelText={'取消'} onCancel={()=>setOpenPass(false)}>
            <Divider />
            <p>{`为职员设置登录密码`}</p>
            <Row>
                <Col span={18}>
                    <Form.Item label='密码' name='loginPassword'
                            // rules={[{required: true, message: '请输入密码'}]}
                            style={{width: '100%', textAlign: 'center'}}
                            hasFeedback>
                    <Input.Password  />
                    </Form.Item>
                </Col>
                <Col span={18}>
                <Form.Item label='确认密码' name='confirm'
                    dependencies={['loginPassword']}
                    rules={[
                        ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('loginPassword') === value) {
                            return Promise.resolve();
                            }
                            return Promise.reject(new Error('与上次密码不匹配'));
                        },
                         }),]} 
                    style={{width: '100%'}}>
                    <Input.Password  />
                </Form.Item>
            </Col>
             </Row>
            {/* <Row style={{width: '100%', marginTop: '15px'}}> */}
            
            <Divider />
        </Modal>
        </>
  )
}

function UserTable () {
  axios.defaults.withCredentials = true; 
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { setFieldsValue, getFieldsValue } = form;
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false)
  const [dataStatus, setDataStatus] = useState(false);  // 标记数据是否改变
  const [openStatus, setOpenStatus] = useState(false)  // 标记表单是否禁用，只有查看的时候禁用，修改不禁用
  const [spinning, setSpinning] = useState(true)
  const department = ['销售部', '采购部', '仓管部']
  const round = ['无登录权限', '全部']

  const onAlterFill = (id) => {
    // 根据所选行的id发送get请求，获取当前行的数据
    setOpen(true)
    setOpenStatus(true)
    axios.post('http://127.0.0.1:8000/staff/searchId/', id, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            let data = response.data[0]
            form.setFieldsValue({...data, department: department[data['department']], loginRound: round[data['loginRound']]})  // 将该行数据设置为表单数据
            console.log(getFieldsValue())
        }
    ).catch(
        err=>console.log(err)
    )

  }
  const columns = [
    {
      title: '职员编号',
      // key:'saleOrderId',
      key:'userId',
      dataIndex: 'userId',
      align: 'center'
    },
    {
      title: '职员名称',
      key: 'userName',
      dataIndex: 'userName',
      align: 'center'
    },
    {
      title: '登录用户名',
      key:'loginName',
      dataIndex: 'loginName',
      align: 'center'
    },
    {
        title: '手机',
        key:'mobile',
        dataIndex: 'mobile',
        align: 'center'
    },
    {
        title: '登录范围',
        key:'loginRound',
        dataIndex: 'loginRound',
        align: 'center',
        render: (_, record) => {
            if(record.loginRound === 0){
                return <Tag color='red'>无登录权限</Tag>
            }else{
                return <Tag color='green'>全部</Tag>
            }
        }
    },
    {
        title: '是否管理员',
        key: 'manager',
        dataIndex: 'manager',
        align: 'center',
        render: (_, record) =>{
            if(record.manager === 0){
                return <CheckOutlined style={{color: 'green'}} /> 
            }else{
                return <CloseOutlined style={{color: 'red'}} />
            }
        }
    },
    {
        title: '状态',
        key:'status',
        dataIndex: 'status',
        align: 'center',
        render: (_, { status }) => {
            if (status === 0){
                return <Badge status="success" text="启用" />
            }else{
                return <Badge status="error" text="未启用" />
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
          <a onClick={()=>{onAlterFill(record.id)}}>编辑</a>
          {dataSource.length >= 1 ? (
            <>
              <Popconfirm title="确定删除吗?" cancelText='取消' okText='确定' onConfirm={() => handleDelete(record.key)}>
                <a>删除</a> 
              </Popconfirm>
            </>) : null}
          <a onClick={()=>{
            let param = {
                id: record.id,
                status: record.status
            }
            axios.post('http://127.0.0.1:8000/staff/setStatus/', param, {headers: {'Content-Type': 'application/json'},}).then(
                res=>{
                    console.log(res.data)
                    setDataStatus(!dataStatus)
                }
            )
          }}>停用 / 启用</a>
        </Space>
      ),
    }
  ];
  useEffect(()=>{
    // 进行ajax请求

    axios.get('http://127.0.0.1:8000/user/show/', {headers: {'Access-Control-Allow-Credentials': true}}).then(
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
    axios.post('http://127.0.0.1:8000/staff/deleteId/', key, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            console.log(response)
            // 设置新的数据源
            setDataStatus(!dataStatus)
        }
    ).catch(
        err=>console.log(err)
    )
  }
  //   提交表单且数据验证成功调用事件
  const onFinish = (values) => {
    console.log(values)
    if (values.loginName){
        values.isLoginUser = '0'
    }else{
        values.isLoginUser = '1'
    }
    // 修改
    if (values.userId){
        console.log(values.status)
        console.log(values)
        axios.post('http://127.0.0.1:8000/staff/alter/', values, {headers: {'Content-Type': 'application/json'},}).then(
            response=>{
                console.log(response)
                setDataStatus(!dataStatus)
                setOpen(false)
            }
        ).catch(
            err=>console.log(err)
        )
    }else{  
    axios.post('http://127.0.0.1:8000/staff/addStaff/', values, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
            if (response.status === 200 && response.data.code === 0)
                {
                    message.error(response.data.msg)
                    // 关闭模态框
                    setOpen(false)
                }
            else{
                // 更改数据状态
                setDataStatus(!dataStatus)
                // 关闭模态框
                setOpen(false)
            }

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
        axios.post('http://127.0.0.1:8000/staff/searchValue/', params, {headers: {'Content-Type': 'application/json'},})
        // axios.post('http://127.0.0.1:8000/api/users/search/', params, {headers: {'Content-Type': 'application/json'},})
        .then(
            response=>{
                console.log(response)
                if(value===''){
                    navigate('/usermessage')
                    setDataStatus(!dataStatus)
                }else{
                    // 展示到页面上
                    navigate(`/usermessage?value=${value}`)
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
    axios.post('http://127.0.0.1:8000/staff/searchStatus/', params, {headers: {'Content-Type': 'application/json'},})
    .then(
        res=>{
            console.log("请求", res)
            if(res.data.msg === '缺少参数')
            {
                navigate('/usermessage')
                setDataStatus(!dataStatus)
            }
            else{
                // 展示到页面上
                navigate(`/usermessage?status=${value}`)
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
        <Search allowClear style={{width: 300, marginLeft: 10}} size='middle' placeholder="请输入职员编号/职员名称" onSearch={onSearch} />
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
            <Button onClick={()=>{setOpen(true);setOpenStatus(false);form.resetFields()}}>新增职员</Button>
        </Col>
      </Row>
      <Spin spinning={spinning}>
        <Table columns={columns} dataSource={dataSource}/>
      </Spin>
      <Modal title='职员信息' footer={false} centered onCancel={()=>{setOpen(false)}} open={open} width={'40%'}>
            <Divider />
            <Form name="basic" form={form} labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} layout="inline"
            autoComplete="off"
            onFinish={onFinish}
            style={{marginTop: 20}}
            >
                <h2><HolderOutlined style={{color: 'blue'}} />&nbsp;基本信息</h2>
                <Row style={{width: '100%'}}>
                    <Col span={12}>
                        <Form.Item label='所属部门' name='department' style={{width: '100%'}}>
                            <Select defaultValue="0"
                                options={[
                                    
                                    {
                                        value: '0',
                                        label: '销售部',
                                    },
                                    {
                                        value: '1',
                                        label: '采购部',
                                    },
                                    {
                                        value: '2',
                                        label: '仓管部'
                                    }
                                    ]}
                             />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='职员编号' name='userId' style={{width: '100%'}}>
                            <Input placeholder='后台递增生成' disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{width: '100%', marginTop: '15px'}}>
                    <Col span={12}>
                        <Form.Item label='职员名称' name='userName' rules={[{required: true, message: '请输入职员名称'}]} style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='手机号' name='mobile' rules={[{required: true, message: '请输入手机号'}]} style={{width: '100%'}}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <h2>
                    <HolderOutlined style={{color: 'blue'}}/>&nbsp;
                    设置登录用户
                    <Switch checked={openStatus} onClick={()=>setOpenStatus(!openStatus)} />
                </h2>
                {openStatus?<User />:null}
                <Divider />
                <Row style={{marginTop: 15, marginLeft: 350}}>
                    <Button type="primary" htmlType='submit' >
                        确定   
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
export default UserTable;
