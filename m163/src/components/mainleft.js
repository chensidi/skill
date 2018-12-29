import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Carousel} from 'element-react';
import '../css/main.css';

class MainLeft extends Component {
    constructor(props){
        super(props);
        this.state = {
            roller: [
                [
                    {
                        pic:'http://p3.music.126.net/ItdXJn0S2HknmSLKPOHYyw==/109951163739049215.jpg?param=100y100',
                        title: "When It's Christmas",
                        aut: '张艺兴'
                    },
                    {
                        pic:'http://p4.music.126.net/v5nRjxjuTGbIMy7xgWt0tQ==/109951163738987643.jpg?param=100y100',
                        title: "垂直活着，水平留恋着。",
                        aut: '艾怡良'
                    },
                    {
                        pic:'http://p3.music.126.net/KfzVw_70vPPWP9cunakYcA==/109951163732971501.jpg?param=100y100',
                        title: "Aquaman (Original Motion Picture Soundtrack)",
                        aut: 'Rupert Gregson-Williams'
                    },
                    {
                        pic:'http://p3.music.126.net/xyNyEzKY-9MlgMpbf1NQuQ==/109951163731909071.jpg?param=100y100',
                        title: "G-ENERGY",
                        aut: 'GENERATIONS from EXILE TRIBE'
                    },
                    {
                        pic:'http://p4.music.126.net/Jg71ymXV0aF04q5e-H9a0g==/109951163745281938.jpg?param=100y100',
                        title: "原生之罪 影视原声带",
                        aut: '群星'
                    }
                ],
                [
                    {
                        pic:'http://p3.music.126.net/SCKSIhCbxlqkC9rTjIWVAQ==/109951163739212997.jpg?param=100y100',
                        title: "进阶",
                        aut: '林俊杰'
                    },
                    {
                        pic:'http://p3.music.126.net/kCi0Cy3rR-OpRtc7ISkZ-A==/109951163725046743.jpg?param=100y100',
                        title: "沙发海。",
                        aut: '艾怡良'
                    },
                    {
                        pic:'http://p4.music.126.net/FGa7ytvHoL5Eigw4sXlC9A==/109951163747890417.jpg?param=100y100',
                        title: "0",
                        aut: '林忆莲'
                    },
                    {
                        pic:'http://p4.music.126.net/mG8qKdonSNSx3Dn1lnJnwA==/109951163738862744.jpg?param=100y100',
                        title: "我要给世界最悠长的湿吻",
                        aut: '蔡健雅'
                    },
                    {
                        pic:'http://p3.music.126.net/fBN4gDVtZ14jnZ9nHKL2aQ==/109951163737293725.jpg?param=100y100',
                        title: "天份",
                        aut: '薛之谦'
                    }
                ]
            ]
        }
    }
    render(){
        return (
            <div className='main_left'>
                <div className='left_wrap'>
                    <div className='rcmd'>
                        <div className='hd'>
                            <Link to=''>热门推荐</Link>
                            <span className='more'>
                                <Link to=''>更多</Link>
                                <i className='more_icon'></i>
                            </span>
                        </div>
                        <ul className='rcmd_list clearfix'>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                            <li>
                                <div className='cover'>
                                    <img alt='' src='http://p2.music.126.net/bZwIbbku1T-ZOpXmbTm8RQ==/109951163753491897.jpg?param=140y140' />
                                    <Link to='' title='【VIP专享】一周新歌推荐'></Link>
                                    <div className='mask'>
                                        <Link to='' className='toplay'></Link>
                                        <span className='hdset'></span>
                                        <span className='nb'>4536万</span>
                                    </div>
                                </div>
                                <p className='dec'>
                                    <Link to='' title='【VIP专享】一周新歌推荐'>【VIP专享】一周新歌推荐</Link>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className='new'>
                        <div className='hd'>
                            <Link to=''>新碟上架</Link>
                            <span className='more'>
                                <Link to=''>更多</Link>
                                <i className='more_icon'></i>
                            </span>
                        </div>
                        <Carousel height="186px" trigger="click" autoplay={false} indicatorPosition='none'>
                        
                            {
                                this.state.roller.map((obj,i)=>{
                                    return (
                                        <Carousel.Item key={i}>
                                            <ul className='roller f-left'>
                                                {
                                                    obj.map((o,j)=>{
                                                        return (
                                                            <li key={j}>
                                                                <div className='s_cover'>
                                                                    <img src={o.pic} alt='' />
                                                                    <Link to='' className='mk'></Link>
                                                                    <Link to='' className='go_play'></Link>
                                                                </div>
                                                                <p className='elp'>{o.title}</p>
                                                                <p className='elp'>{o.aut}</p>
                                                            </li>
                                                        )
                                                    })
                                                
                                                }
                                            </ul>
                                        </Carousel.Item>
                                    )
                                })
                            }
                            
                                
                                
                            
                            
                        
                        </Carousel>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainLeft;