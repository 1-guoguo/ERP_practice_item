import { Tabs, Alert } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { Layout } from 'antd';
import { useRoutes, useNavigate } from 'react-router-dom';
import routes from '../../routes/routes';
import PubSub from 'pubsub-js';
import './index.css'
const { TabPane } = Tabs
const { Header } = Layout;
const defaultPanes = [{
    // label: `Tab ${id}`,
    label: '主页',
    // children: `Content of Tab Pane ${index + 1}`,
    path: '/home',
    key: '1',
    // closable: false,
}]



function TabHeader () {
    const element = useRoutes(routes)
    const navigate = useNavigate()
    const [tabs, setTabs] = useState([defaultPanes[0].label])
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    // 路由链接的状态，默认是Home
    const [routePath, setRoutePath] = useState([defaultPanes[0].path]);

    const newTabIndex = useRef(0);
    const onChange = (key) => {
        setActiveKey(key);
    };

    const add = (data) => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        // const newActiveKey = newTabIndex
        console.log("我执行了")
        setTabs([...tabs, data.label])
        // 更新路由链接的状态
        setRoutePath([...routePath, data.path])
        setItems([...items, {...data, key: newActiveKey}])
        setActiveKey(newActiveKey);
    };
    useEffect( ()=>{
        // 进行消息接收
        const topicNav = PubSub.subscribe('data', (_, newData)=>{
            // 收到导航栏的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = newData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(newData)
            }
        })
        // 接收销售按钮传过来的数据
        const topicSale = PubSub.subscribe('sale', (_, saleData)=>{
            // 收到按钮的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = saleData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(saleData)
            }
        })
        // 接收销售按钮传过来的数据
        const topicSI = PubSub.subscribe('saleInstorage', (_, saleData)=>{
            // 收到按钮的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = saleData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(saleData)
            }
        })
        // 接收销售按钮传过来的数据
        const topicSO = PubSub.subscribe('saleOutrage', (_, saleData)=>{
            // 收到按钮的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = saleData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(saleData)
            }
        })
        // 接收采购按钮传过来的数据
        const topicPur = PubSub.subscribe('purchase', (_, purchaseData)=>{
            // 收到按钮的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = purchaseData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(purchaseData)
            }
        })
        // 接收采购按钮传过来的数据
        const topicPI = PubSub.subscribe('purchaseInstorage', (_, purchaseData)=>{
            // 收到按钮的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = purchaseData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(purchaseData)
            }
        })
        // 接收采购按钮传过来的数据
        const topicPO = PubSub.subscribe('purchaseOutstorage', (_, purchaseData)=>{
            // 收到按钮的数据，调用add回调函数，增加页签，等待更新
            const {label, path} = purchaseData
            //   判断，如果原先的列表已经有，就不再更新，否则更新
            if (tabs.includes(label)){
                // 打开到现有的tab页面,根据新传过来的path重定向
                navigate(path)
                // 根据路径找到items中的索引
                const itemIndex = routePath.indexOf(path)
                // 当前激活面板的key设置为路由对应的key
                setActiveKey(items[itemIndex].key)
            }
            else{
                console.log("111111")
                // 执行add标签
                add(purchaseData)
            }
        })
        console.log('@')
        // 组件卸载的时候，删除数据
        return ()=>{
            console.log("组件卸载了")
            PubSub.unsubscribe(topicNav)
            PubSub.unsubscribe(topicSale)
            PubSub.unsubscribe(topicPur)
            PubSub.unsubscribe(topicPI)
            PubSub.unsubscribe(topicPO)
            PubSub.unsubscribe(topicSI)
            PubSub.unsubscribe(topicSO)
        }
      }, [items,]); // 里边为什么加items，因为当item变化一次，就要更新一次，否则不会更新页面
    // 组件加载完成，将消息发布过来
    // 增加Tab标签的事件，应该是点击某一项，这一项的内容作为新标签
    
    // 删除tab标签
    const remove = (targetKey) => {
        let targetIndex = items.findIndex((pane) => pane.key === targetKey);  // 移除的面板的key
        // console.log(targetIndex)
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        const newTabs = tabs.filter((tab, index, tabs) => tabs.indexOf(tab) !== targetIndex)
        const newRoutePath = routePath.filter((path, index, routepath) => routepath.indexOf(path) !== targetIndex)
        // 根据当前路由链接重新打开页面
        if (newRoutePath.length === targetIndex){
            // 说明当前要关闭的标签页是最后一个，所以列表-1
            navigate(newRoutePath[targetIndex - 1])
        }else{
            // 说明不是最后一个，而是中间，所以不变
            navigate(newRoutePath[targetIndex])
        }
        // 如果标签页只剩下一个标签，提示至少打开一个标签
        if(newPanes.length){
            if(targetKey === activeKey){
                const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
                setActiveKey(key);
                setTabs(newTabs);
                setRoutePath(newRoutePath)
                setItems(newPanes);
            }
        }
        else{
            // 做一个弹窗
            <Alert message="Error" type="error" showIcon />
            console.log("不可以关闭")
        }

    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    const handleTabClick = (target) => {
        // 点击tab标签，如果路由链接='./home'，就显示主页的内容
        // 根据路由链接显示相应的内容
        // 根据targetKey找到所在的路由，或者将key直接设置为路径？
        const targetIndex = items.findIndex((pane) => pane.key === target);
        navigate(routePath[targetIndex])

    }
    //把选中的选项卡存入localStorage里边 
    localStorage.setItem('tabList', JSON.stringify(tabs))
    return (
        <Header className='headerStyle'>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                onTabClick={handleTabClick} // 点击tab标签触发的事件
                items={items}
            />
            <TabPane>
                {element}
            </TabPane>
        </Header>
    );
};
export default TabHeader;
