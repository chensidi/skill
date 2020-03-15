import React, {Component} from 'react';
import {connect} from 'react-redux';
import {changeActive} from '../store/actions';
import axios from 'axios';

import {WingBlank, NavBar, Icon } from 'antd-mobile';
function mapStateToProps(state){
    return {
        count: state.reducer.active,
        api: state.reducer.api,
        scroll: state.reducer.scroll
    }
}

function mapActionToProps(dispatch){
    return {
        changeView: (num)=>{dispatch(changeActive(num))},
    }
}

class News extends Component {
    constructor(props){
        super(props);
        this.state = {
            newsUrl: '',
            html: '',
            cmtNum: 0
        }
    }

    componentWillMount(){
        console.log(this.props.match.params);
        let params = this.props.match.params.id.split('|')
        let url = `https://api.dongqiudi.com/article/${params[1]}.html?from=${params[0]}`
        this.setState({
            newsUrl: url,
            cmtNum: params[2]
        },()=>{
            this.loadNews();
        })
    }

    back = () => {
        this.props.history.go(-1);
        // console.log(this.props.scroll)
        // console.log(document.getElementsByClassName('react-weui-infiniteloader')[0]);
        setTimeout(()=>{
            document.getElementsByClassName('react-weui-infiniteloader')[0].scrollTop = this.props.scroll
        },10)
    }

    loadNews = () => {
        axios({
            url: `${this.props.api}/template?url=${this.state.newsUrl}`,
            timeout: 15000
        }).then(res=>{
            console.log(res);
            if(res.status === 200){
                this.setState({
                    html: res.data.main
                })
            }
        })
    }

    render() {
        return (
            <div className="news_div">
                <div className="top_art">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={this.back}
                    rightContent={[
                        <span key="cmt" className="hd_cmt">{this.state.cmtNum}评论</span>
                    ]}
                >
                    NavBar
                </NavBar>
                </div>
                <div className="news_content">
                    <WingBlank>
                        <div dangerouslySetInnerHTML = {{__html:this.state.html}} ></div>
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapActionToProps)(News);