import React, {Component} from 'react'
import { Comment, Avatar, Icon, Tooltip,BackTop} from 'antd';
import {InfiniteLoader} from 'react-weui'
import {connect} from 'react-redux'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import $ from 'jquery'
import moment from 'moment';
// const actions = [
//     <span>
//       <Tooltip title="Like">
//         <Icon
//           type="like"
//           theme={'outlined'}
//         />
//       </Tooltip>
//       <span style={{ paddingLeft: 8, cursor: 'auto' }}>
//         666
//       </span>
//     </span>,
//     <span>Reply to</span>,
// ];

const actions = (num)=>{
    return [
        <span>
        <Tooltip title="Like">
            <Icon
            type="like"
            theme={'outlined'}
            />
        </Tooltip>
        <span style={{ paddingLeft: 8, cursor: 'auto' }}>
            {num}
        </span>
        </span>,
        <span>Reply to</span>,
    ]
}

const ExampleComment = ({ children }) => (
    <Comment
      actions={actions}
      author={<a>Han Solo</a>}
      avatar={(
        <Avatar
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          alt="Han Solo"
        />
      )}
      content={<p>We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</p>}
    >
      {children}
    </Comment>
);

const beReplied = (obj)=>{
    if(obj==null)return false;
    return (
        <Comment
            author={<a>{obj.user.nickname}</a>}
            avatar={(
                <Avatar
                src={obj.user.avatarUrl}
                alt={obj.user.nickname}
                />
            )}
            content={<p>{obj.content}</p>}
            datetime={(<Tooltip title={moment().subtract(parseInt($.now()-obj.time)/(1000*3600*24), 'days').format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(parseInt($.now()-obj.time)/(1000*3600*24), 'days').fromNow()}</span>
          </Tooltip>)}
        >
        </Comment>
    )
}

class Comments extends Component {
    constructor(props){
        super(props);
        this.state = {
            cmtArr: [],
            hotArr: [],
            sid: localStorage.getItem('sid'),
            page: 1,
            more: false,
            getKey: false
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.cmtObj!=null){
            this.setState({
                cmtArr: [],
                hotArr: [],
                more: false,
                page: 1,
                sid: localStorage.getItem('sid')
            },()=>{
                this.setState({
                    cmtArr: nextProps.cmtObj.comments,
                    hotArr: nextProps.cmtObj.hotComments,
                    more: nextProps.cmtObj.more,
                    page: 1
                })
                this.props.allowGetMore();
            })
        }
    }

    getMore = (resolve, finish)=>{
        if(this.state.more&&this.props.getMoreKey){
            $.get(`${this.props.myApi}/comment/music?id=${this.state.sid}&offset=${this.state.page*20}`).then(dt=>{
                if(dt.code!=200)return;
                this.setState(prev=>({
                    cmtArr: prev.cmtArr.concat(dt.comments),
                    page: prev.page + 1,
                    more: dt.more
                }),()=> resolve())
                if(!dt.more){
                    finish();
                }
            })
        }
    }

    render(){
        if(this.props.leave){
            return false;
        }
        return (
            <div className='cmt_box'>
                <BackTop/>
                <div className='topbar'><i className='left' onClick={this.props.hideCmt}><Icon type="left" /></i>评论({this.props.cmtObj?this.props.cmtObj.total:0})</div>
                <InfiniteLoader
                    onLoadMore={ (resolve, finish) => {
                        this.getMore(resolve, finish)
                    }}
                >
                    <h4>精彩评论</h4>
                    {
                        this.state.hotArr.map((item,i)=>{
                            return (
                                <Comment
                                    key={i}
                                    actions={actions(item.likedCount)}
                                    author={<a>{item.user.nickname}</a>}
                                    avatar={(
                                            <Avatar
                                            src={item.user.avatarUrl}
                                            alt={item.user.nickname}
                                            />
                                    )}
                                    content={<p>{item.content}</p>}
                                    datetime={(<Tooltip title={moment().subtract(parseInt($.now()-item.time)/(1000*3600*24), 'days').format('YYYY-MM-DD HH:mm:ss')}>
                                    <span>{moment().subtract(parseInt($.now()-item.time)/(1000*3600*24), 'days').fromNow()}</span>
                                  </Tooltip>)}
                                    >
                                    {
                                        beReplied(item.beReplied[0])
                                    }
                                </Comment>
                            )
                        })
                    }
                    <h4>最新评论</h4>
                    <hr />
                    {
                        this.state.cmtArr.map((item,i)=>{
                            return (
                                <Comment
                                    key={i}
                                    actions={actions(item.likedCount)}
                                    author={<a>{item.user.nickname}</a>}
                                    avatar={(
                                            <Avatar
                                            src={item.user.avatarUrl}
                                            alt={item.user.nickname}
                                            />
                                    )}
                                    content={<p>{item.content}</p>}
                                    datetime={(<Tooltip title={moment().subtract(parseInt($.now()-item.time)/(1000*3600*24), 'days').format('YYYY-MM-DD HH:mm:ss')}>
                                    <span>{moment().subtract(parseInt($.now()-item.time)/(1000*3600*24), 'days').fromNow()}</span>
                                  </Tooltip>)}
                                    >
                                    {
                                        beReplied(item.beReplied[0])
                                    }
                                </Comment>
                            )
                        })
                    }
                </InfiniteLoader>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Comments);