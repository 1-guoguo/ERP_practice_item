// 保质期预警
// 库存明细表
import { Table, Row, Col, Button, Form, Input, Select, Tag, Modal, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

function NegativeWarning () {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([])
    const [open, setOpen] = useState(false)
    const [spinning, setSpinning] = useState(true)
    const columns = [
    {
    title: '商品名称',
    width: 100,
    dataIndex: 'tradeName',
    key: 'tradeName',
    fixed: 'left',
    align: 'center',
    } ,
    {
    title: '商品编号',
    width: 100,
    dataIndex: 'tradeNo',
    key: 'tradeNo',
    fixed: 'left',
    align: 'center',
  },
  {
    title: '规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 150,
    align: 'center',
  },
  {
    title: '型号',
    dataIndex: 'model',
    key: 'model',
    width: 150,
    align: 'center',
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
    width: 150,
    align: 'center',
  },
  {
    title: '备注',
    dataIndex: 'review',
    key: 'review',
    width: 150,
    align: 'center',
  },
  {
    title: '数量',
    dataIndex: 'inventory',
    key: 'inventory',
    width: 150,
    fixed: 'right',
    align: 'center',
    render: (_, record) => {
        return <Tag color='red'>{record.inventory}</Tag>
    } 
  },
    ];
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/store/getNegative/').then(
            res=>{
                for (let i in res.data){
                    let inv = res.data[i]['inventory']
                    if (inv < 0){
                        message.warning(`${res.data[i]['tradeName']}已无库存，请补货`)
                    }
                }
                setDataSource(res.data)
                setSpinning(false) 
            }
        )
    }, [])
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const onFinish = (values) => {
        axios.post('http://127.0.0.1:8000/store/getFilter/', values, {headers: {'Content-Type': 'application/json'},}).then(
            res=>{
                console.log(res.data)
                setDataSource(res.data) 
            }
        ).catch(
            err=>console.log(err)
        )
    }
    const addInv = (value) => {
        console.log(value)
        axios.post(
            'http://127.0.0.1:8000/store/addInv/', 
            value, 
            {headers: {'Content-Type': 'application/json'}}
        ).then(
            res=>{
                if (res.data.code === 1 && res.status === 200){
                    message.error(res.data.msg)
                }else{
                    message.success(res.data.msg)
                }
            }
        ).catch(

        )
    }
    return (
    <>
      <Form name="search" 
            autoComplete="off"
            onFinish={onFinish}>
            <Row style={{marginLeft: 10}}>
                <Col span={4} >
                    <Form.Item name='search'>
                        <Input allowClear placeholder="请输入商品编号/商品名称/商品备注" />
                    </Form.Item>
                </Col>
                <Col span={4}  style={{marginLeft: 10}}>
                    <Form.Item name='warehouseNo' label='仓库'>
                        <Input allowClear placeholder='请输入仓库编号'/>
                    </Form.Item>
                </Col>
                <Col span={4}  style={{marginLeft: 10}}>
                    <Form.Item name='status' label='停用过滤' rules={[{required: true}]} >
                        <Select options={
                            [{value: '3', label: '全部'},
                                {value: '0', label: '不显示停用商品'},
                                {value: '1', label: '只显示停用商品'}]
                        }/>
                    </Form.Item>
                </Col>
                <Col span={2}  style={{marginLeft: 10}}>
                    <Button type='primary' htmlType='submit'>查询</Button>
                </Col>
            </Row>
      </Form>
      <Button onClick = {()=>{setOpen(true)}} style={{marginBottom: 5, marginLeft: 10}}>申请补货</Button>
      <Spin spinning={spinning}>
      <Table rowKey={(record)=>record.id}
            columns={columns}
            rowSelection={rowSelection}
            dataSource={dataSource}
            scroll={{
                x: 1500,
            }}
            sticky
    />
    </Spin>
    <Modal title='填写补货单' open={open} footer={false} onCancel={()=>setOpen(false)}>
       <Form name="addInv" 
            autoComplete="off"
            onFinish={addInv}>
            <Form.Item name='tradeName' label='商品名称' >
                <Input placeholder='请输入要补货的商品名称'/>
            </Form.Item>
            <Form.Item name='inventory' label='补货数量' >
                <Input placeholder='请输入要增加的库存'/>
            </Form.Item>
            <Row style={{marginLeft: 150}}>
                <Col span={8}>
                    <Button type='primary' htmlType='submit' onClick={()=>setOpen(false)}>确认</Button>
                </Col>
                <Col span={3}>
                    <Button onClick={()=>setOpen(false)}>取消</Button>
                </Col>
                
            </Row>
            
       </Form>
    </Modal>
    </>
  );
};
export default NegativeWarning;