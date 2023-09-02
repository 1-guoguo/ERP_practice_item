import {HomeOutlined, AppstoreOutlined, MailOutlined, DatabaseOutlined} from '@ant-design/icons'
import { Navigate } from 'react-router-dom'
import SaleManagement from "../pages/SaleOrder/SaleManagement"
import SaleOutStorage from '../pages/SaleOrder/SaleOutStorage'
import SaleQueryPage from '../pages/SaleOrder/SaleQueryPage'
import SaleReturnPage from '../pages/SaleOrder/SaleReturnPage'
import PurchaseManagement from "../pages/PurchasingPage/PurchaseManagement"
import PurchaseOutStorage from "../pages/PurchasingPage/PurchaseInStorage"
import PurchaseQueryPage from "../pages/PurchasingPage/PurchaseQueryPage"
import PurchaseReturnPage from "../pages/PurchasingPage/PurchaseReturnPage"
import StoreMessage from "../pages/DetailPage/StoreMessage"
import SupplierMessage from "../pages/DetailPage/SupplierMessage"
import CustomerMessage from "../pages/DetailPage/CustomerMessage"
import WarehouseMessage from "../pages/DetailPage/WarehouseMessage"
import UserMessage from "../pages/DetailPage/UserMessage"
import InventoryDetail from '../pages/InventoryPage/InventoryDetail'
import ShelfLife from '../pages/InventoryPage/ShelfLife'
import NegativeWarning from '../pages/InventoryPage/NegativePage'
import Home from '../pages/Home'
import LoginPage from '../pages/LoginPage'
export default [
    // 登录路由
    {
        path: '/login',
        element: <LoginPage />
    },
    // 主页路由
    {
        label: '主页',
        key: 'home',
        path: '/home',
        icon: <HomeOutlined />,
        element: <Home />
    },
    // 资料页面路由
    {
        label: "资料",
        key: "sub1",
        // path: '/message',
        icon:<DatabaseOutlined />,
        children: [{
            key: 'storagemessage',
            label:'商品信息',
            path: '/storagemessage',
            element: <StoreMessage />,
        },
        {
            key: 'manage',
            label: '供应商/客户管理',
            path: '/manage',
            element: <SupplierMessage />
        },
        // {
        //     key: 'customermanage',
        //     label:'客户管理',
        //     path: '/customermanage',
        //     element: <CustomerMessage />,
        // },
        {
            key: 'warehouse',
            label: '存货仓库',
            path: '/warehouse',
            element: <WarehouseMessage />,
        },
        {
            key: 'usermessage',
            label:'职员管理',
            path: '/usermessage',
            element: <UserMessage />,
        },
    ]
    },
    // 销售订单页面路由
    {
        key: 'sub2',
        label: '销售管理',
        icon: <MailOutlined />,
        children: [{
            key: 'salemanagement',
            label:'销售订单管理',
            path: '/salemanagement',
            element: <SaleManagement />,
        },
        // 还没完成编写
        {
            key: '/saleoutrage',
            label: '销售出库单',
            path: '/saleoutrage',
            element: <SaleOutStorage />,
        },
        {
            key: '/salereturn',
            label: '销售退货单',
            path: '/salereturn',
            element: <SaleReturnPage />,
        },
        {
            key: '/salequery',
            label: '销售单据查询',
            path: '/salequery',
            element: <SaleQueryPage />,
        }],
    },
    // 采购管理
    {
        key: 'sub3',
        label: '采购管理',
        icon: <AppstoreOutlined />,
        children:[{
            key: 'purchaseorder',
            label: '采购订单管理',
            path: '/purchaseorder',
            element: <PurchaseManagement />,
        },{
            key: 'purchaseinstorage',
            label: '采购入库单',
            path: '/purchaseinstorage',
            element: <PurchaseOutStorage />,
        },
        {
            key: 'purchasereturn',
            label: '采购退货单',
            path: '/purchasereturn',
            element: <PurchaseReturnPage />,
        },
        {
            key: 'purchasequery',
            label: '采购单据查询',
            path: '/purchasequery',
            element: <PurchaseQueryPage />,
        }]  
    },
    // 仓库管理
    {
        key: 'sub4',
        label: '仓库管理',
        icon: <HomeOutlined />,
        children:[{
            key: 'inventorydetail',
            label: '库存明细',
            path: '/inventorydetail',
            element: <InventoryDetail />,
        },
        {
            key: 'ShelfLifewarn',
            label: '保质期预警',
            path: '/ShelfLifewarn',
            element: <ShelfLife />,
        },
        {
            key: 'NegativeWarning',
            label: '负库存预警',
            path: '/NegativeWarning',
            element: <NegativeWarning />,
        },]
    },
    // 财务管理
    // {
    //     key: 'sub5',
    //     label: '财务管理',
    //     icon: <MoneyCollectOutlined />,
    //     children: [{
    //         key:'30',
    //         label:'发票管理',
    //         children: [{
    //             key: '31',
    //             label: '开票信息管理',
    //             path: '/home',
    //             element: '',
    //         },
    //         {
    //             key: '32',
    //             label: '销项发票管理',
    //             path: '/home',
    //             element: '',
    //         },
    //         {
    //             key: '33',
    //             label: '销项发票管理',
    //             path: '/home',
    //             element: '',
    //         }
    //     ]
    //     }]

    // },
    // 经营分析
    // {

    // },
    {
        path: '*',
        element: <Navigate to='/home'/>
    }
]