import React from 'react'
import { Form, Input, DatePicker, Select } from 'antd'
export default function PurchaseList() {
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };
  return (
    <Form name="basic" labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} layout="inline"
    // style={{
    //   maxWidth: 600,
    // }}
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
         },
        ]}
        >
         <Input />
      </Form.Item>
      <Form.Item
        label="发货仓库"
        name="deliveryWarehouse"
        rules={[
        {
          required: true,
         },
        ]}
        >
         <Input />
      </Form.Item>
      <Form.Item
        label="交货日期"
        name="deliveryDate"
        >
        <DatePicker onChange={onChange} />
      </Form.Item>
      <Form.Item
        label="交货方式"
        name="deliveryWays"
      >
        <Select
          showSearch
          placeholder="Select a way"
          optionFilterProp="children"
          onChange={onChange}
          // onSearch={onSearch}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={[
            {
              value: '快递物流',
              label: 'express',
            },
          ]}
          />
      </Form.Item>
      <Form.Item
        label="经手人"
        name="handeredBy"
        >
         <Input />
      </Form.Item>
  </Form>
  )
}
