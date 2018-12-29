import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../css/main.css';

class MainRight extends Component {
    constructor(props){
        super(props);
        this.state = {
            sideArr: [
                {
                    pic: 'http://p2.music.126.net/p9U80ex1B1ciPFa125xV5A==/5931865232210340.jpg?param=62y62',
                    name: '张惠妹aMEI',
                    dec: '台湾歌手张惠妹'
                },
                {
                    pic: 'http://p2.music.126.net/1EN_iqQWU_E3DafzEOh3cA==/3302932937408956.jpg?param=62y62',
                    name: 'Fine乐团',
                    dec: '独立音乐人'
                },
                {
                    pic: 'http://p2.music.126.net/ZuktZvjcxpYBjcWC3gmbPg==/19027048718765608.jpg?param=62y62',
                    name: '萬曉利',
                    dec: '民谣歌手、中国现代民谣的代表人物之一'
                },
                {
                    pic: 'http://p2.music.126.net/v_zYgE9kmAwVGWV2c8hFxA==/7943971513291094.jpg?param=62y62',
                    name: '音乐人赵雷',
                    dec: '民谣歌手'
                },
                {
                    pic: 'http://p2.music.126.net/U-duMw2-FE0wNRsuwGktPw==/109951162895674268.jpg?param=62y62',
                    name: '王三溥',
                    dec: '音乐人'
                }
            ]
        }
    }

    render(){
        return (
            <div className='main_right'>
                <div className='myinfo'>
                    <p className='note'>
                    登录网易云音乐，可以享受无限收藏的乐趣，并且无限同步到手机
                    </p>
                    <button>用户登录</button>
                </div>
                <div className='hot_side'>
                    <h3 className='v-hd3'>
                        <span className='f-left'>入驻歌手</span>
                        <Link to='' className='f-right'>查看全部&gt;</Link>
                    </h3>
                    <ul className='hot_top'>
                        {
                            this.state.sideArr.map((obj,i)=>{
                                return (
                                    <li key={i}>
                                        <Link to=''>
                                            <div className='hds'>
                                                <img src={obj.pic} alt='' />
                                            </div>
                                            <div className='ifo'>
                                                <h4 className='elp'>{obj.name}</h4>
                                                <p>{obj.dec}</p>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

export default MainRight;