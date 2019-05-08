import React, {Component} from 'react'
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import {Icon,List} from 'antd'
import $ from 'jquery'
import Imask from '../components/mask'

class History extends Component {
    constructor(){
        super();
        this.state = {
            list: [],
            showMask: true
        }
    }
    back = ()=>{
        this.props.history.go(-1)
    }

    componentWillMount(){
        let {myApi} = this.props,
            user = localStorage.getItem('user');
        user = JSON.parse(user);
        if(user.uid!=null||user.uid!=''){
            $.get(`${myApi}/user/record?uid=${user.uid}&type=0`).then(dt=>{
                if(dt.code!=200)return;
                this.setState({
                    list: dt.allData
                },()=>{
                    setTimeout(()=>{
                        this.setState({
                            showMask: false
                        })
                    },500)
                })
            })
        }
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
                    <div className='topbar'><i className='left' onClick={this.back}><Icon type="left" /></i><h3>play history</h3></div>
                </div>
                <div style={{marginTop:'50px'}}>
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.list}
                        renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                            onClick={this.goPlay.bind(this,item.song)}
                            title={<p>{item.song.name}</p>}
                            description={item.song.ar[0].name}
                            />
                        </List.Item>
                        )}
                    />
                </div>
                <Imask showMask={this.state.showMask} />
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(History);
