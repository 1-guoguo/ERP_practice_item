import React from 'react'
import Tables from '../../component/Sale/SaleManagement'
import SaleList from '../../component/Sale/SaleList'

export default function SaleTable() {
  return (
    <>
      <h2 style={{textAlign: "center"}}>销售订单</h2>
      <SaleList />
      <Tables />
    </>
  )
}