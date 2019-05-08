import { Carousel } from 'antd';
import React, {Component} from 'react';
import {mapStateToProps,mapDispatchToProps} from '../store/mutation'
import {connect} from 'react-redux'
import $ from 'jquery'

class Banner extends Component {
    constructor(){
        super();
        this.state = {
            img: []
        }
    }

    componentWillMount(){
        let {myApi} = this.props;
        $.get(`${myApi}/banner`).then(dt=>{
            if(dt.code!=200)return;
            this.setState({
                img: dt.banners.slice(0,4)
            })
        })
    }

    render(){
        return (
            <div className='row banner'>
                <Carousel autoplay effect="fade">
                    {
                        this.state.img.map((obj,i)=>{
                            return (
                                <div key={i}>
                                    <img src={obj.imageUrl} />
                                </div>
                            )
                        })
                    }
                </Carousel>
            </div>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Banner);