// 保质期预警
// 库存明细表
import { Table, Row, Col, Button, Form, Input, DatePicker, Tag, message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
dayjs.locale('zh-cn');

function ShelfLifeWarnTable () {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([])
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
    title: '生产日期',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
    align: 'center',
  },
  {
    title: '保质期',
    dataIndex: 'sell_by_date',
    key: 'sell_by_date',
    width: 150,
    align: 'center',
  },
  {
    title: '到期日期',
    dataIndex: 'expire_date',
    key: 'expire_date',
    width: 150,
    align: 'center',
  },
  {
    title: '即将过期天数',
    dataIndex: 'expiringDays',
    key: 'expiringDays',
    width: 150,
    align: 'center',
    render: (_, record) => {
        let expire = record.expiringDays
        if(expire < 0){
            // setFlag(true)
            
            return (
                <Tag color='red'>{expire}已过期</Tag>
            )
        }
        else if (expire < 20){
            return (
                <Tag color='gold'>{expire}即将过期</Tag>
            )
        }
        else{
            return(
                <Tag color='green'>{expire}</Tag>
            )
        }
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    render: (_, record)=>{
        let id = record.id
        return (

            <Button onClick={()=>{axios.post('http://127.0.0.1:8000/store/setStatus/', id, {headers: {'Content-Type': 'application/json'},})}}>点击禁用</Button>

            )
    }
  }
    ];
    useEffect(()=>{
        axios.get('http://127.0.0.1:8000/store/getStore/').then(
            res=>{
                const data = new Array();
                for (let i in res.data){
                    let time = new Date();
                    let endDate = new Date(res.data[i]['expire_date'].replace(/-/g, "/"));
                    const expiringDays = parseInt((endDate - time) / (1000 * 60 * 60 * 24))
                    if(expiringDays < 0)
                    {
                        message.warning(`${res.data[i]['tradeName']}已过期`)
                    }
                    const obj = {...res.data[i], expiringDays: expiringDays}
                    console.log(obj)
                    data[i] = obj

                }
                setDataSource(data)    
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
        console.log(values)
        axios.post('http://127.0.0.1:8000/store/search/', values, {headers: {'Content-Type': 'application/json'},}).then(
            res=>{
                console.log(res.data)
                const data = new Array();
                for (let i in res.data){
                    let time = new Date();
                    let endDate = new Date(res.data[i]['expire_date'].replace(/-/g, "/"));
                    const expiringDays = parseInt((endDate - time) / (1000 * 60 * 60 * 24))
                    // if(expiringDays > 0)
                    // {
                    //     setDisable(true)
                    // }
                    const obj = {...res.data[i], expiringDays: expiringDays}
                    console.log(obj)
                    data[i] = obj

                }
                console.log("111", data)
                setDataSource(data) 
            }
        ).catch(
            err=>console.log(err)
        )
    }
    return (
    <>
      <Form name="search" 
                autoComplete="off"
                onFinish={onFinish}>
                <Row style={{marginLeft: 10}}>
                    <Col span={4} >
                        <Form.Item name='createTime' label='生产日期'>
                            <DatePicker allowClear
                            locale={locale}
                            placeholder='年-月-日' onChange={(value, dataString)=>console.log("value", typeof(dataString))}
                            format={'YYYY-MM-DD'}/>
                        </Form.Item>
                    </Col>
                    <Col span={4}  style={{marginLeft: 10}}>
                        <Form.Item name='expire_date' label='到期日期'>
                            <DatePicker allowClear
                            locale={locale}
                            placeholder='年-月-日' onChange={(value, dataString)=>console.log("value", typeof(dataString))}
                            format={'YYYY-MM-DD'} />
                        </Form.Item>
                    </Col>
                    <Col span={4}  style={{marginLeft: 10}}>
                        <Form.Item name='tradeName' label='商品'>
                            <Input placeholder='商品名称' allowClear/>
                        </Form.Item>
                    </Col>
                    <Col span={4}  style={{marginLeft: 10}}>
                        <Form.Item name='warehouseName' label='仓库'>
                            <Input placeholder='仓库名称' allowClear/>
                        </Form.Item>
                    </Col>
                    <Col span={2}  style={{marginLeft: 10}}>
                        <Button type='primary' htmlType='submit'>查询</Button>
                    </Col>
                </Row>
      </Form>
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
    </>
  );
};
export default ShelfLifeWarnTable;