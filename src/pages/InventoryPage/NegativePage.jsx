import React from 'react'
import NegativeWarning from '../../component/Inventory/NegativeWarning'

export default function InventoryDetail() {
  return (
    <>
        <h2 style={{textAlign: 'center'}}>负库存预警</h2>
        <NegativeWarning />
    </>
  )
}