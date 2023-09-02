import { Button, Tabs } from 'antd';
import { useRef, useState, useEffect, Component } from 'react';
import { Layout } from 'antd';
import './index.css'
const { Header } = Layout;
const defaultPanes = new Array(1).fill(null).map((_, index) => {
  const id = String(index + 1);
  return {
    // label: `Tab ${id}`,
    label: '主页',
    // children: `Content of Tab Pane ${index + 1}`,
    key: id,
  };
});



function Headers ( { tabData } ) {
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);

    const newTabIndex = useRef(0);
    const onChange = (key) => {
        setActiveKey(key);
    };
    // 组件加载完成，将消息发布过来
    // 增加Tab标签的事件，应该是点击某一项，这一项的内容作为新标签
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        // const newActiveKey = data
        
        setItems([
        ...items,
        {
            label: tabData,
            // children: 'New Tab Pane',
            key: newActiveKey,
        },
        ]);
        setActiveKey(newActiveKey);
    };
    // 删除tab标签
    const remove = (targetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
        setActiveKey(key);
        }
        setItems(newPanes);
    };
    const onEdit = (targetKey, action) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };
    return (
        <Header className='headerStyle'>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
        </Header>
    );
};
export default Headers;
