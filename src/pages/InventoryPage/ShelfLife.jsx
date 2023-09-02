import React from 'react'
import ShelfLifeWarnTable from '../../component/Inventory/ShelfLifeWarning'

export default function InventoryDetail() {
  return (
    <>
        <h2 style={{textAlign: 'center'}}>保质期预警</h2>
        <ShelfLifeWarnTable />
    </>
  )
}