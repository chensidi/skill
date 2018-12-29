import React, { Component } from 'react';
import MainLeft from './mainleft';
import MainRight from './mainright';
import '../css/main.css';

class Main extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className='main clearfix'>
                <MainLeft />
                <MainRight />
            </div>
        )
    }
}

export default Main;