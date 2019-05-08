import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Icon,List,Tabs } from 'antd'
import $ from 'jquery'
import Imask from '../components/mask'
import { StickyContainer, Sticky } from 'react-sticky';
import {Panel,
    PanelHeader,
    PanelBody,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    }from 'react-weui'

const TabPane = Tabs.TabPane;
const renderTabBar = (props, DefaultTabBar) => (
    <Sticky bottomOffset={80}>
      {({ style }) => (
        <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
      )}
    </Sticky>
  );

class Sublist extends Component {
    constructor(){
        super();
        this.state = {
            singerList: []
        }
    }

    componentWillMount(){
        let {myApi} = this.props,
            user = localStorage.getItem('user');
        user = JSON.parse(user);
        if(user.uid!=null||user.uid!=''){
            $.get(`${myApi}/login/cellphone?phone=${user.tel}&password=${user.pwd}`).then(dt=>{
                if(dt.code == 200){
                    $.get(`${myApi}/artist/sublist`).then(dt=>{
                        console.log(dt);
                        this.setState({
                            singerList: dt.data
                        })
                    })
                }
            })
            
        }
    }

    back = ()=>{
        this.props.history.go(-1);
    }
    render(){
        return (
            <div className='album wrap'>
                <div className='album_hd'>
                    <div className='topbar'><i className='left' onClick={this.back}><Icon type="left" /></i><h3>play history</h3></div>
                </div>
                <div className='sticky'>
                    <StickyContainer>
                        <Tabs defaultActiveKey="1" renderTabBar={renderTabBar}>
                        <TabPane tab="singer" key="1">
                            <Panel>
                                <PanelHeader>
                                    Media with image
                                </PanelHeader>
                                <PanelBody>
                                    {
                                        this.state.singerList.map((item,i)=>{
                                            return (
                                                
                                                    <MediaBox key={i} type="appmsg" href="javascript:void(0);">
                                                        <MediaBoxHeader>
                                                            <img src={item.img1v1Url} />
                                                        </MediaBoxHeader>
                                                        <MediaBoxBody>
                                                        <Link to=''>
                                                            <MediaBoxTitle>{item.name}</MediaBoxTitle>
                                                            <MediaBoxDescription>
                                                                {item.alias[0]}
                                                            </MediaBoxDescription>
                                                        </Link>
                                                        </MediaBoxBody>
                                                    </MediaBox>
                                                
                                            )
                                        })
                                    }
                                </PanelBody>
                            </Panel>
                        </TabPane>
                        <TabPane tab="MV" key="2">Content of Tab Pane 2</TabPane>
                        
                        </Tabs>
                    </StickyContainer>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Sublist);
