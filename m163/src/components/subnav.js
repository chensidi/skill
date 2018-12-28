import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import '../css/topbar.css';
// import {Input,Dropdown} from 'element-react';

class Subnav extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className='subnav'>
                <div className='main_sub'>
                    <ul className='sub_nav'>
                        <li>
                            <Link to=''><em className='on'>推荐</em></Link>
                        </li>
                        <li>
                            <Link to=''><em >排行榜</em></Link>
                        </li>
                        <li>
                            <Link to=''><em>歌单</em></Link>
                        </li>
                        <li>
                            <Link to=''><em>歌手</em></Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Subnav;
