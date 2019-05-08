import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {TabBar,
        TabBarItem,
        TabBarIcon, 
        TabBarLabel
    } from 'react-weui'
import '../static/public.css'
import {withRouter} from 'react-router-dom'
import {Icon} from 'antd'

class Tabbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            bar: 0
        }
    }
    handleClick = (num)=>{
        let {setTabbarState} = this.props;
        setTabbarState(num);
    }
    
    handleChangeTab(num){
        this.props.history.replace(num)
    }

    componentDidMount(){
        this.setState({
            bar: this.props.tabbar
        })
    }

    render() {
        let {tabbar} = this.props;
        return (
            <div className='tabbar'>
            
                <TabBar>
                    <TabBarItem active={this.props.tabbar == 0} onClick={this.handleChangeTab.bind(this,'/home')}>
                        <TabBarIcon>
                            <Icon type="home" theme={this.props.tabbar == 0?'filled':''} />
                        </TabBarIcon>
                        <TabBarLabel>home</TabBarLabel>
                    </TabBarItem>
                    <TabBarItem active={this.props.tabbar == 1} onClick={this.handleChangeTab.bind(this,'/play')}>
                        <TabBarIcon>
                            <Icon type="customer-service" theme={this.props.tabbar == 1?'filled':''} />
                        </TabBarIcon>
                        <TabBarLabel>play</TabBarLabel>
                    </TabBarItem>
                    <TabBarItem active={this.props.tabbar == 2} onClick={this.handleChangeTab.bind(this,'/my')}>
                        <TabBarIcon>
                            <Icon type="user" />
                        </TabBarIcon>
                        <TabBarLabel>my</TabBarLabel>
                    </TabBarItem>
                </TabBar>
                
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Tabbar));