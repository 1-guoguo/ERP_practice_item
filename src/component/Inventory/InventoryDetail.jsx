// 库存明细表
import { Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
  
function InventoryDetailTable () {
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
  },
  {
    title: '商品编号',
    width: 100,
    dataIndex: 'tradeNo',
    key: 'tradeNo',
    fixed: 'left',
  },
  {
    title: '规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 150,
  },
  {
    title: '型号',
    dataIndex: 'model',
    key: 'model',
    width: 150,
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    key: 'brand',
    width: 150,
  },
  {
    title: '库存数量',
    dataIndex: 'inventory',
    key: 'inventory',
    width: 150,
    editable: true,
  },
  {
    title: '安全库存',
    dataIndex: 'safeInventory',
    key: 'safeInventory',
    width: 150,
  },
  ];
  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/store/getStore/").then(
      res=>{
        setDataSource(res.data)
        setSpinning(false)
      }
    )
  },[])
  const handleDelete = (key) => {
        console.log(key)
        const newData = dataSource.filter((item) => item.key !== key);
        console.log(newData)
        setDataSource(newData)
  }
  const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
  };
  return (
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
  );
};
export default InventoryDetailTable;