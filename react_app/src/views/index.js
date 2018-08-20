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
            appContent = this.props.history.location.pathname.replace(/^[+/]$/,'')
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

AppPage = withRouter(AppPage);

export default AppPage;