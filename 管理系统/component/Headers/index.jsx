import { Button, Tabs } from 'antd';
import { useRef, useState } from 'react';
import { Layout } from 'antd';
import './index.css'
const { Header } = Layout;
const defaultPanes = new Array(2).fill(null).map((_, index) => {
  const id = String(index + 1);
  return {
    label: `Tab ${id}`,
    // children: `Content of Tab Pane ${index + 1}`,
    key: id,
  };
});

function Headers () {
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    const newTabIndex = useRef(0);
    const onChange = (key) => {
        setActiveKey(key);
    };
    const add = () => {
        const newActiveKey = `newTab${newTabIndex.current++}`;
        setItems([
        ...items,
        {
            label: 'New Tab',
            children: 'New Tab Pane',
            key: newActiveKey,
        },
        ]);
        setActiveKey(newActiveKey);
    };
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
                {/* <Button onClick={add}>ADD</Button> */}
            <Tabs
                hideAdd
                onChange={onChange}
                // activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
        </Header>
    );
};
export default Headers;