import React, {Component} from 'react';
import {Icon} from 'antd';
import '../static/css/home.css';

class Mask extends Component {
    render() {
        return (
            <div className="laoding-mask" style={{'display':this.props.isLoading?'flex':'none'}}>
                <i>
                    <Icon type="loading" style={{fontSize:30}} />
                </i>
            </div>
        )
    }
}

export default Mask;