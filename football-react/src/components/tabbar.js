import { TabBar } from 'antd-mobile';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Icon} from 'antd';


import {connect} from 'react-redux';
import {changeActive} from '../store/actions';

function mapStateToProps(state){
    return {
        count: state.reducer.active,
        api: state.reducer.api,
    }
}

function mapActionToProps(dispatch){
    return {
        changeView: (num)=>{dispatch(changeActive(num))},
    }
}

class TabBarExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: false,
    };
  }


  render() {
    return (
        <div style={{position:'fixed',bottom:'0',width:'100%'}}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="首页"
            key="Home"
            icon={
                <Icon type="home" style={{fontSize:20}} />
            }
            selectedIcon={
                <Icon type="home" theme="filled" style={{fontSize:20}} />
            }
            selected={this.props.count == 1}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab',
              });
              this.props.history.push('/');
              document.getElementsByClassName('react-weui-infiniteloader')[0]&&document.getElementsByClassName('react-weui-infiniteloader')[0].scrollTo(0,0);
            }}
            data-seed="logId"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
                <Icon type="play-circle" style={{fontSize:20}} />
            }
            selectedIcon={
                <Icon type="play-circle" theme="filled" style={{fontSize:20}} />
            }
            title="比赛"
            key="Match"
            selected={this.props.count == 2}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
              });
              this.props.history.push('/match');
            }}
            data-seed="logId1"
          >
          </TabBar.Item>
          <TabBar.Item
            icon={
                <Icon type="database" style={{fontSize:20}} />
            }
            selectedIcon={
                <Icon type="database" style={{fontSize:20}} theme="filled" />
            }
            title="数据"
            key="Data"
            selected={this.state.selectedTab === 'greenTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'greenTab',
              });
            }}
          >
          </TabBar.Item>

        </TabBar>
        </div>
    );
  }
}

export default connect(mapStateToProps,mapActionToProps)(withRouter(TabBarExample));