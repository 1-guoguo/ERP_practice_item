1. 使用ant-design组件

2. 日期格式化使用了dayjs
    import dayjs from 'dayjs';
    import 'dayjs/locale/zh-cn';
    import locale from 'antd/es/date-picker/locale/zh_CN';
    dayjs.locale('zh-cn');

    dayjs(value).format('YY-MM-DD)

3. 实现了动态的标签头
    使用antd的Tabs组件，结合react的消息传递机制，实现了标签头的动态增加与删除
    因为是初学者，没有使用redux状态管理机制，简单使用了PubSub进行组件之间的通信
    存在一个小bug：刷新一下页面，标签头就会还原成初始的一个

4. 后台使用python的django框架实现