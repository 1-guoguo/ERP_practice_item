// 销售出库单
// 销售订单管理
import { Button, Modal, Tag, Table, Layout, Form, Row, Col, Input, message, InputNumber, Typography, DatePicker, Select  } from 'antd';
import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import PubSub from 'pubsub-js';
import './index.css'
import { useNavigate } from 'react-router-dom';
dayjs.locale('zh-cn');
const { Content } = Layout;
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

function PurchaseReturnTables () {
  const [tForm] = Form.useForm();
  const navigate = useNavigate()
  const [dataSource, setDataSource] = useState([])  // 首页表格数据源
  const [storeData, setStoreData] = useState([])  // 商品表格数据源
  const [orderData, setOrderData] = useState([])  // 订单表数据源
  const [openOrder, setOpenOrder] = useState(false)  // 打开选择订单模态框
  const [open, setOpen] = useState(false)  // 打开选择商品模态框
  const [butShow, setButShow] = useState(true)  // 设置按钮显示
  const [show, setShow] = useState(false)  // 设置表单禁用

  const orderColumns = [
    {
      title: '已出库订单编号',
      // key:'saleOrderId',
      key:'documentsNo',
      dataIndex: 'documentsNo',
    },
    {
      title: '供货单位',
      key:'supplierUnit',
      dataIndex: 'supplierUnit',
    },
    {
      title: '订单状态',
      key:'orderStatus',
      dataIndex: 'orderStatus',
      render: (_, record)=>{
        let status = ['内容待审核', '内容审核中', '内容审核不通过', '内容审核已通过', '订单已确定']
        return <Tag color='blue'>{status[record.orderStatus]}</Tag>
      }
    },
    {
      title: '入库仓库',
      key:'inStorage',
      dataIndex: 'inStorage',
    },
    {
      title: '入库数量',
      key:'number',
      dataIndex: 'number',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return(
          <Button onClick={()=>clickOrder(record.documentsNo)}>选择</Button>
        )
      }
    }
  ]
  // 选择订单，并显示数据到页面上
  const clickOrder = (key) => {
    // 通过id获取到订单
    axios.post('http://127.0.0.1:8000/purchaseOrder/getMsg/', key, {headers: {'Content-Type': 'application/json'}}).then(
      response=>{
        console.log("res",response.data)
        // 通过获得的goosId获得商品信息
        let goodsId = response.data[0]['goodsNo']
        console.log("cons",goodsId)
        const params = {
          value: goodsId
        }
        axios.post('http://127.0.0.1:8000/store/searchValue/', params, {headers: {'Content-Type': 'application/json'},}).then(
          res=>{
            setDataSource(res.data)
          }
        )
        const value = {
          'sourceOrderNo': response.data[0]['orderNo'],
          'supplierUnit': response.data[0]['supplierUnit'],
          'handerBy': response.data[0]['handerBy'],
          'outStorage': response.data[0]['warehouseName'],
        }
        // 设置表单数据
        setTimeout(()=>{
          tForm.setFieldsValue(value)
          console.log("表单数据", tForm.getFieldsValue())
        },1000)
        setOpenOrder(false)
      }
    ).catch(
      err=>console.log(err)
    )
  }
  const columns = [ 
    {
      title: '商品编号',
      key: 'tradeNo',
      dataIndex: 'tradeNo',
    },
    {
      title: '商品名称',
      key:'tradeName',
      dataIndex: 'tradeName',
    },
    {
      title: '规格',
      key:'specification',
      dataIndex: 'specification',
    },
    {
      // orderQuantity：订单数量只是预计，实际出库数量才是要修改的
      title: '退回数量',
      key: 'number',
      dataIndex: 'number',
      editable: true,
    },
    {
      title: '退回金额',
      key: 'account',
      dataIndex: 'account',
      editable: true,
    }, 
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <a onClick={()=>{
            // 使用id进行过滤，删掉这一行
            const newData = dataSource.filter((item)=>item.id !== record.id)
            setDataSource(newData)
          }}
          >移除</a>
        )
      }
    }
  ]
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
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <Button onClick={()=>{clickStore(record.id)}}>选择</Button>
        )
      }
    }
  ];
  // 选择商品
  const clickStore = (key) => {
    // 通过id选择商品信息
    axios.post('http://127.0.0.1:8000/store/searchId/', key, {headers: {'Content-Type': 'application/json'},}).then(
        response=>{
          console.log(response.data)
            console.log(response.data[0])  // 得到一个对象
            let data = response.data[0]
            console.log(data.status)
            console.log("数据", {...dataSource, data})
            // 设置首页表格数据源
            setDataSource([...dataSource, response.data[0]])
            setOpen(false)  
        }
    )
  }
  // 保存采购退货单
  const onFinish = (values) => {
    // 获取表格数据,表格数据就是数据源 
    let formvalue = new Object()
    formvalue.goodsNo = dataSource[0]['tradeNo']  // 表格里边只有一条数据的情况
    formvalue.outStorageNumber = dataSource[0]['number']
    formvalue.account = dataSource[0]['account']
    const value = {...values, recordTime: dayjs(values.recordTime).format('YYYY-MM-DD'), ...formvalue}
    // 如果有单据编号，证明是修改的
    if (values.documents){
      axios.post('http://127.0.0.1:8000/outStorage/alter/', value, {headers: {'Content-Type': 'application/json'}}).then(
        res=>{
          // 请求成功，路由监听，先不管，保存之后保存按钮消失不见变成新增，整页内容不可修改
          setButShow(false)
          setShow(true)
          message.success({
            content: '修改成功',
          });
        }
      ).catch(
        err=>console.log(err)
      )
    }else{
    axios.post('http://127.0.0.1:8000/outStorage/saveReturn/', value, {headers: {'Content-Type': 'application/json'}}).then(
      res=>{
        // 请求成功，如果该商品不可退货，给出提醒
        if (res.status === 200 && res.data.code === 0){
          console.log('11111', res.data.msg)
          message.warning(res.data.msg)
        }
        setButShow(false)
        setShow(true)
        message.success({
          content: '保存成功',
        });
      }
    ).catch(
      err=>console.log(err)
    )
    }
  }
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const column = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
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
      value: '1',
      label: '采购-采购退货单'
    },
  ]
  useEffect(()=>{
    console.log('@@@')
    // 如果接受到数据
    PubSub.subscribe('purchaseOutstorage', (_, documentsNo)=>{
      // 数据展示到表单
      console.log(documentsNo)
      // 通过id获取到订单
    axios.post('http://127.0.0.1:8000/documents/showx/', documentsNo, {headers: {'Content-Type': 'application/json'}}).then(
      response=>{
        console.log("res",response.data)
        // 通过获得的goosId获得商品信息
        let goodsId = response.data[0]['goodsNo']
        console.log("cons",goodsId)
        const params = {
          value: goodsId
        }
        axios.post('http://127.0.0.1:8000/store/searchValue/', params, {headers: {'Content-Type': 'application/json'},}).then(
          res=>{
            setDataSource([{...res.data[0], number: response.data[0]['outStorageNumber'], account: response.data[0]['number']}])
          }
        )
        const value = {
          'outStorageNo': response.data[0]['outStorageNo'],
          'sourceOrderNo': response.data[0]['sourceOrderNo'],
          'supplierUnit': response.data[0]['returnUnit'],
          'orderStatus': response.data[0]['orderStatus'],
          'handerBy': response.data[0]['handerBy'],
          'outStorage': response.data[0]['outStorage'],
          'documentsType': response.data[0]['documentsType'],
          'recordTime': dayjs(response.data[0]['recordTime'])
        }
        // 设置表单数据
        setTimeout(()=>{
          tForm.setFieldsValue(value)
          console.log("表单数据", tForm.getFieldsValue())
        },1000)
        setOpenOrder(false)
      }
    ).catch(
      err=>console.log(err)
    )
    })
  },[])
  return (
    <Content className='contentStyle'>
      <Form name="sale" 
            form={tForm} 
            autoComplete="off"
            onFinish={onFinish}
            >
              <Button 
                type='primary'
                style={{marginLeft: 10, marginBottom: 10}}
                onClick={()=>{setOpenOrder(true); axios.get('http://127.0.0.1:8000/documents/getIn/').then(response=>{setOrderData(response.data)})}}>选择退货订单</Button>
            <Row style={{marginLeft: 10}}>
              <Col span={4} >
                <Form.Item name='outStorageNo' label='单据编号'>
                  <Input placeholder='单据编号自动生成' disabled/>
                </Form.Item>
              </Col>
              <Col span={4} style={{marginLeft: 10}} >
                <Form.Item name='sourceOrderNo' label='关联订单编号' rules={[{required: true}]}>
                  <Input disabled={show}/>
                </Form.Item>
              </Col>
              <Col span={4} style={{marginLeft: 10}}>
                <Form.Item name='supplierUnit' label='退回单位'  rules={[{required: true}]}>
                  <Input disabled={show}/>
                </Form.Item>
              </Col>
              <Col span={4} style={{marginLeft: 10}} >
                <Form.Item name='orderStatus' label='单据状态' rules={[{required: true}]}>
                  <Select onChange={(value)=>console.log(value)} options={options} disabled={show} />
                </Form.Item>
              </Col>
              <Col span={4} style={{marginLeft: 10}}>
                <Form.Item name='handerBy' label='经手人'  rules={[{required: true}]}>
                  <Input disabled={show}/>
                </Form.Item>
              </Col>
              </Row>
              <Row>
              <Col span={4} style={{marginLeft: 10}}>
                <Form.Item name='outStorage' label='出库仓库'  rules={[{required: true}]}>
                  <Input disabled={show}/>
                </Form.Item>
                </Col>
              <Col span={4} style={{marginLeft: 10}}>
                <Form.Item name='documentsType' label='入库单据类型'  rules={[{required: true}]}>
                  <Select onChange={value=>console.log(value)} options={optionType} disabled={show} />
                </Form.Item>
                </Col>
                <Col span={4} style={{marginLeft: 10}}>
                <Form.Item name='recordTime' label='处理日期'  rules={[{required: true}]}>
                  <DatePicker locale={locale} disabled={show} format={'YYYY-MM-DD'}/>
                </Form.Item>
                </Col>
                <Col span={4} style={{marginLeft: 10}}>
                <Form.Item name='review' label='附加说明' >
                  <Input disabled={show}/>
                </Form.Item>
                </Col>
              </Row>
      <Row style={{marginBottom: '5px'}}>
            <Col span={8}>
                <Button 
                  type='primary' 
                  style={{marginLeft: 10, marginBottom: 10}}
                  onClick={()=>{axios.get('http://127.0.0.1:8000/store/getStore/').then(response=>{console.log(response);setStoreData(response.data);setOpen(true);})}}>选择商品</Button>
            </Col>
            <Col span={2} offset={12}>
              {butShow?(<Button htmlType='submit' disabled={show}>保存</Button>):(<Button onClick={()=>{setShow(false);tForm.resetFields()}}>新增</Button>)}
            </Col>
            <Col span={2}>
              <Button onClick={()=>{navigate('/salequery')}}>关闭</Button>
            </Col>
      </Row>
        <Form.Item name='goodsNo'>
          <Table columns={column} dataSource={dataSource} 
          components={components}
          bordered
          rowClassName={() => 'editable-row'}
          // rowSelection={{
          //   onChange: (selectedRowKeys, selectedRows) => {
          //     selectRoleRow=selectedRows;
          // },
        />
        </Form.Item>
      </Form>
      {/* 商品信息模态框 */}
      <Modal
        title="商品信息表"
        centered
        open={open}
        onOk={()=>setOpen(false)}  // 点击确定的时候，保存选中的信息到表格中
        onCancel={()=>{setOpen(false)}}
        cancelText={'取消'}
        okText={'确定'}
        width={'55%'}
        footer={false}
        >
          <Table dataSource={storeData} columns={storeColumns}></Table>
      </Modal>
      {/* 订单信息模态框 */}
      <Modal
        title="订单信息表"
        centered
        open={openOrder}
        onOk={()=>setOpenOrder(false)}  // 点击确定的时候，保存选中的信息到表格中
        onCancel={()=>{setOpenOrder(false)}}
        cancelText={'取消'}
        okText={'确定'}
        width={'55%'}
        footer={false}
        >
          <Table rowKey={(record)=>record.id} dataSource={orderData} columns={orderColumns}></Table>
      </Modal>
    </Content>
  );
};
export default PurchaseReturnTables;
