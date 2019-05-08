import React, {Component} from 'react'
import {Mask} from 'react-weui'
import { Spin } from 'antd';

class Imask extends Component {
    render(){
        return (
            <div className={this.props.showMask?'loadingmask':'hide'}>
                <Mask />
                <div className='loading_spin'>
                    <Spin size="large" />
                </div>,
            </div>
        )
    }
}

export default Imask;