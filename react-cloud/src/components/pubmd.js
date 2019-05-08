import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Icon} from 'antd'

class Pubmd extends Component {
    constructor(props){
        super(props);
        this.state = {
            dtArr: []
        }
    }

    componentWillReceiveProps(nextprops){
        this.setState({
            dtArr: nextprops.data
        })
    }
    render(){
        return (
            <div className='pubmd'>
                <h2 className='pbmd_tt'>{this.props.title}</h2>
                <div className='f-wrap pubwrap'>
                    {
                        this.state.dtArr.map((obj,i)=>{
                            return (
                                <Link to='' key={i}>
                                    <div className='pbmd_media'>
                                        <img src={obj.coverImgUrl||obj.picUrl} />
                                        <div className='drop'>
                                            <span className='listen'>
                                                <Icon type="customer-service" />{obj.playCount||0}
                                            </span>
                                            <span className='playicon'>
                                                <Icon type="play-circle" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className='pbmd_info'>
                                        <h3 className='elp'>{obj.name}</h3>
                                        <p className=''>{obj.tag||obj.artists[0].name}</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default Pubmd;