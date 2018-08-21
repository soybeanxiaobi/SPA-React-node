### 一、 什么是单页面富应用?
> 单页面应用:Single Page Application   

* 概念:Web应用即使不刷新也在不同的页面间切换,解决浏览器前进、后退等机制被破坏等问题。并且页面访问会被浏览器保存。  
* 实现方法:
    1. Node+Html5实现
    2. React/Vue等MVVM框架

### 二、单页面应用的实现
#### 1. Node+Html5
H5实现单页面应用为什么需要Node?  
虽然使用的是H5的新特性:History API,但是单页面应用实际上是利用路由变化从而判断是否改变内容。这里仅用node开启服务,url地址的变化采用的是H5的History API。  
##### 步骤
1. 使用express自动化构建项目
```
express myAppName
```
2. 去掉多余路由文件(user.js),修改App.js渲染文件的类型(默认jade => html)
```
app.engine('html',require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
```
3. 编写index.html  
项目效果:点击相应button,url路由和底部内容都会相应变化   
![node+h5](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180821095534478-1678804927.png)

```
//html
<div class="appWried">
    <div class="appBtn">
        <button>PAGE1</button>
        <button>PAGE2</button>
        <button>PAGE3</button>
    </div>
    <div class="appContent">
        暂无内容
    </div>
</div>
```
```
<script src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
<script>
$(function(){
    var button = $('.appBtn button');

    button.click(function(){
        let route = $(this).text(); //获取按钮的文本
        //把按钮内容当做url路由导航
        pageChange(route);

        //history.pushState 添加浏览器历史
        history.pushState('','',route)   //state回调函数传入对象 title新页面标题 url新页面路径,地址栏会显示新路径
    })

    //根据点击或者路由改变相应的页面内容
    function pageChange(route){
        console.log(route);
        button.removeClass('active');

        //filter() 方法将匹配元素集合缩减为匹配指定选择器的元素
        button.filter(function(){
            return $(this).text() == route;
        }).addClass('active');
        
        //改变内容
        $('.appContent').text(`我是${route}`);
    }
})
</script>
```
这里为了方便,我采用了JQuery的官方CDN。  
pushState是html5的History新增的。
```
window.history.pushState(json,title,url)  
// 状态对象：记录历史记录点的额外对象，可以为空  
// 页面标题：目前所有浏览器都不支持, 可以为空  
// 可选的url：浏览器不会检查url是否存在，只改变url，url必须同域，不能跨域  
```
此外,pushState经常搭配监听历史记录点事件window.onpopstate来监听url的变化。并且可以获取存储在该历史记录点的状态对象，也就是pushState存储的json对象。例如：  
```
window.addEbentListener('popState',function(){
    console.log('url改变')
})
```

#### 2. React
现在很多前端框架都追求组件化开发、组件化复用。组件化和单页面应用非常配。所以React、Vue等也常常用于SPA的开发。  
使用React开发SPA至少需要用到:React、React-router(-dom)  
> <font color="red">项目使用的是React-router-dom。</font>  
react-router 和 react-router-dom 的不同之处就是后者比前者多出了 <Link> <BrowserRouter> 这样的 DOM 类组件。并且react-router-dom是其升级版,可以更快更新,react-router即将废弃.  

项目效果:  
![React+SPA](https://images2018.cnblogs.com/blog/1414709/201808/1414709-20180821101523936-2102792754.png)
```
//views/index.js
import React from 'react';
import { Link,withRouter } from 'react-router-dom'
import './style.css'

class AppPage extends React.Component{
    constructor(arg){
        super(arg)

        this.state={}
    }

    render(){
        let appContent = ''
        if(this.props.history.location.pathname){
            appContent = this.props.history.location.pathname
        }else{
            appContent = '暂无内容'
        }

        return(
            <div className="appWried">
                <div className="appBtn">
                    <Link to="/PAGE1">
                        <button className={ this.props.history.location.pathname === '/PAGE1' ? 'active' : '' }>PAGE1</button>
                    </Link>
                    <Link to="/PAGE2">
                        <button className={ this.props.history.location.pathname === '/PAGE2' ? 'active' : '' }>PAGE2</button>
                    </Link>
                    <Link to="/PAGE3">
                        <button className={ this.props.history.location.pathname === '/PAGE3' ? 'active' : '' }>PAGE3</button>
                    </Link>
                </div>
                <div className="appContent">
                    {appContent}
                </div>
            </div>
        )
    }
}

AppPage = withRouter(AppPage); //通过withRouter给AppPage组件注入路由信息

export default AppPage;
```
```
//App.js
import AppPage from './views/index'
<Router>
    ...
    <AppPage />
    ...
</Router>
```
> 注意:使用了route、withRouter需要在app.js最外层嵌套Router组件  

至此,利用React实现简单的SPA就完成了！

### 三、总结
&nbsp;&nbsp;&nbsp;单页面应用开发在前端已经是不可或缺了。单页面应用既有它的优点,也有它的缺点。  
#### 优点:
1. 良好的交互体验

用户不需要重新刷新页面，获取数据也是通过Ajax异步获取，页面显示流畅。

2. 良好的前后端工作分离模式

单页Web应用可以和RESTful规约一起使用，通过REST API提供接口数据，并使用Ajax异步获取，这样有助于分离客户端和服务器端工作。更进一步，可以在客户端也可以分解为静态页面和页面交互两个部分。

3. 减轻服务器压力

服务器只用出数据就可以，不用管展示逻辑和页面合成，吞吐能力会提高几倍；

4. 共用一套后端程序代码  

不用修改后端程序代码就可以同时用于Web界面、手机、平板等多种客户端；

#### 缺点:
1. SEO难度较高

由于所有的内容都在一个页面中动态替换显示，所以在SEO上其有着天然的弱势，所以如果你的站点对SEO很看重，且要用单页应用，那么就做些静态页面给搜索引擎用吧。

2. 前进、后退管理

由于单页Web应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理，当然此问题也有解决方案，比如利用URI中的散列+iframe实现。

3. 初次加载耗时多

为实现单页Web应用功能及显示效果，需要在加载页面的时候将JavaScript、CSS统一加载，部分页面可以在需要的时候加载。所以必须对JavaScript及CSS代码进行合并压缩处理，如果使用第三方库，建议使用一些大公司的CDN，因此带宽的消耗是必然的。

> 转载于:https://www.cnblogs.com/wbxjiayou/p/6155340.html

解决SPA的SEO(搜索引擎优化):SSR(服务器渲染)  
SSR:服务器将每个要展示的页面都运行完成后，将整个相应流传送给浏览器，所有的运算在服务器端都已经完成，浏览器只需要解析 HTML 就行。

具体SSR作用下次介绍～  

附上上面代码的github:[SPA的实现](https://github.com/soybeanxiaobi/SPA-React-node)
