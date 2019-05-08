import React, {Component} from 'react'
import { Progress } from 'antd';
import {Link} from 'react-router-dom'

let time = null;
class Start extends Component {
    constructor(){
        super();
        this.state = {
            timePC: 0
        }
    }
    componentWillMount(){
        time = setInterval(()=>{
            this.setState(prev=>({
                timePC: prev.timePC + 1
            }),()=>{
                if(this.state.timePC>=100){
                    clearInterval(time);
                    this.props.history.push('/home');
                }
            })
        },50)
    }
    render(){
        return (
            <div className='start'>
                <div className='timer'>
                    <Progress 
                    type="circle" percent={this.state.timePC}  width={50} 
                    />
                </div>
            </div>
        )
    }
}

export default Start;