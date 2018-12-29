import React, { Component } from 'react';
import '../css/main.css';
import $ from 'jquery';

class TopBtn extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: this.props.show
        }
    }
    componentWillReceiveProps(newprops){
        this.setState({
            show: newprops.show
        })
    }   
    backTop(){
        $('html').animate({'scrollTop':0},500);
    }
    render(){
        if(!this.state.show){
            return null;
        }
        return (
            <a href='#' className='m_back' title='对到顶部' onClick={this.backTop}>对到顶部</a>
        )
    }
}

export default TopBtn;