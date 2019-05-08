import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import LazyLoad from 'react-lazyload'
import { Spin } from 'antd';
class Publist extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            
                <Link to={'/album/'+this.props.idx} className='topic_item'>
                    <div className='topic_media'>
                    <LazyLoad height={100} debounce={500} once={true}  overflow throttle={0} offset={0}
                        placeholder={<Spin size='large' />}
                    >
                        <img src={this.props.data.coverImgUrl} />
                        </LazyLoad>
                    </div>
                    <div className='topic_info'>
                        <div className='topic_cont'>
                            <h3>{this.props.data.name}</h3>
                            {
                                this.props.data.tracks.map((obj,i)=>{
                                    return (
                                        <p className='elp' key={i}>{i+1}. <span className='text_name'>{obj.name}</span>{obj.ar[0].name}</p>
                                    )
                                })
                            }
                        </div>
                        <i className='more'></i>
                    </div>
                </Link>
            
        )
    }
}

export default Publist;