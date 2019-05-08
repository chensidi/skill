import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {Icon,List} from 'antd'
import $ from 'jquery'
import Imask from '../components/mask'

class UserList extends Component {
    constructor(){
        super();
        this.state = {
            list: [],
            obj: null,
            showMask: true
        }
    }

    componentWillMount(){
        let {myApi} = this.props,
            id = this.props.match.params.id;
        $.get(`${myApi}/playlist/detail?id=${id}`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                list: dt.playlist.tracks,
                obj: dt.playlist
            },()=>{
                setTimeout(()=>{
                    this.setState({
                        showMask: false
                    })
                },500)
            })
        })
    }

    back = ()=>{
        this.props.history.go(-1);
    }

    goPlay = (item)=>{
        localStorage.setItem('sid',item.id);
        this.props.history.replace('/play');
        let historySongs = localStorage.getItem('historySongs');
        if(historySongs != null){
            historySongs = JSON.parse(historySongs);
            var key = false;
            for(let obj of historySongs){
                if(obj.sid === item.id){
                    key = true;
                    break;
                }
            }
            if(!key){
                historySongs.push({sid:item.id,name:item.name,singer:item.ar[0].name});
                localStorage.setItem('historySongs',JSON.stringify(historySongs))
            }
        }else{
            localStorage.setItem('historySongs',JSON.stringify([{sid:item.id,name:item.name,singer:item.ar[0].name}]))
        }
    }

    render(){
        return (
            <div className='album wrap'>
                <div className='album_hd'>
                    <div className='topbar'><i className='left' onClick={this.back}><Icon type="left" /></i><h3>grate list</h3></div>
                </div>
                <div className='album_head'>
                    <img className='cover_img' src={this.state.obj?this.state.obj.creator.backgroundUrl:'http://p1.music.126.net/pmHS4fcQtcNEGewNb5HRhg==/2002210674180202.jpg'} />
                    <div className='al_bg'></div>
                    <div className='album_info'>
                        <img src={this.state.obj?this.state.obj.coverImgUrl:'http://p2.music.126.net/GhhuF6Ep5Tq9IEvLsyCN7w==/18708190348409091.jpg'} />
                        <div>
                            <h3>{this.state.obj?this.state.obj.name:''}</h3>
                            <div>
                                create: {this.state.obj?this.state.obj.creator.nickname:''}
                            </div>
                            <p>播放量：{this.state.obj?(this.state.obj.playCount/10000).toFixed(2)+'万':''}</p>
                        </div>
                    </div>
                </div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list}
                    renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        onClick={this.goPlay.bind(this,item)}
                        title={<p>{item.name}</p>}
                        description={item.ar[0].name}
                        />
                    </List.Item>
                    )}
                />
                <h2 className='text-center qui_tit'>歌单简介</h2>
                <div className='intro'>
                    <p>{this.state.obj?this.state.obj.description:'暂无简介'}</p>     
                </div>
                <div className='brand'>
                    <img src='https://y.gtimg.cn/mediastyle/mod/mobile/img/logo.svg?max_age=2592000' />
                    <p className='text-center'>qq music</p>
                </div>
                <Imask showMask={this.state.showMask} />

            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(UserList)
