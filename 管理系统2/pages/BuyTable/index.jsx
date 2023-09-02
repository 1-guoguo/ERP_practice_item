import { Button, Table, Layout, Form, Input } from 'antd';
import { useState } from 'react';
const { Content } = Layout;
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
function BuyTable () {
  console.log("点我！")
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Content className='contentStyle'>
      {/* <div
        style={{
          marginTop: 310,
        }}
      >
         <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
          Reload
        </Button> 
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div> */}
      <h2 style={{textAlign: "center"}}>xxxxxxxxxxxx</h2>
      {/* <Form
        name="basic"
        labelCol={{
        span: 8,
        }}
        wrapperCol={{
        span: 16,
        }}
        layout="inline"
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        autoComplete="off"
       >
          <Form.Item
          label="销售机构"
          name="saleOrganization"
          rules={[
            {
              required: true,
              // message: 'Please input your username!',
             },
          ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="购买单位"
            name="purchasingUnit"
            rules={[
            {
              required: true,
              // message: 'Please input your password!',
             },
            ]}
            >
             <Input />
          </Form.Item>
      </Form> */}
      {/* <Table rowSelection={rowSelection} columns={columns} dataSource={data}/> */}
    </Content>
  );
};
export default BuyTable;